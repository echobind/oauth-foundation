import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  Button,
  Divider,
  Flex,
  Image,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { prisma } from '@/lib/prisma';
import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { getServerAuthSession } from '@/utils/getDefaultServerSideProps';

export const scopeDescriptions = {
  email: 'Access your email address.',
  profile: 'Access your basic profile information.',
};

function LoginPage({ email, scope, state, redirect_uri, clientApp }: any) {
  const loading = false;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Authorize {clientApp.app_name}</title>
      </Head>

      <CenteredBoxForm>
        <Stack spacing="6" as="form" method="POST" action="/api/auth/authComplete">
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Image maxW="60px" src={clientApp.app_icon_url} alt={clientApp.app_name}></Image>

            <Text as="h2" fontSize="xl" fontWeight="bold" textAlign="center" marginTop={2}>
              Authorize {clientApp.app_name}
            </Text>
            <Text textAlign="center" my={4}>
              {clientApp.app_name} wants access to your account.
            </Text>
            <Text fontSize="sm">
              Signed in as {email} <Link>Not you?</Link>
            </Text>
            <Divider my={4} />
            <Text fontWeight="bold" fontSize="sm" casing="uppercase" display="block" w="full">
              This will allow {clientApp.app_name} to:
            </Text>
            <UnorderedList w="full">
              {scope
                .split(',')
                .filter((scope: keyof typeof scopeDescriptions) => scopeDescriptions[scope])
                .map((scope: keyof typeof scopeDescriptions) => (
                  <ListItem key={scope} ml={4} my={2}>
                    {scopeDescriptions[scope]}
                  </ListItem>
                ))}
            </UnorderedList>
            <Divider my={4} />
          </Flex>

          <Flex gap={4}>
            <Button
              flex={1}
              colorScheme="red"
              variant="solid"
              type="button"
              onClick={() => router.replace('/')}
            >
              Cancel
            </Button>
            <Button
              flex={1}
              variant="outline"
              type="submit"
              disabled={loading}
              data-testid="login-submit"
            >
              Authorize
            </Button>
          </Flex>
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="state" value={state} />
          <input type="hidden" name="redirect_uri" value={redirect_uri} />
          <input type="hidden" name="client_id" value={clientApp.client_id} />
        </Stack>
      </CenteredBoxForm>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const { response_type, client_id, redirect_uri, scope, state } = context.query;

  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination: `/login?return_url=${encodeURIComponent(
          `/auth?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`
        )}`,
        permanent: false,
      },
    };

  if (typeof client_id !== 'string') throw new Error('Query param client_id is required');

  const clientApp = await prisma.oAuthApp.findUniqueOrThrow({
    where: { client_id },
    select: {
      client_id: true,
      app_description: true,
      app_homepage_url: true,
      app_icon_url: true,
      app_name: true,
      OAuthCallbackURL: { select: { callback_url: true } },
    },
  });

  if (!clientApp.OAuthCallbackURL.some(({ callback_url }) => callback_url === redirect_uri)) {
    throw new Error('Invalid redirect_uri');
  }

  return { props: { email: session.user.email, scope, state, redirect_uri, clientApp } };
}

export default LoginPage;
