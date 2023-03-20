import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/utils/getDefaultServerSideProps';
import { generateAccessToken } from '@/lib/crypto';

export default async function testTranslation(req: NextApiRequest, res: NextApiResponse) {
  const { scope, state, redirect_uri, client_id } = req.body;

  const session = await getServerAuthSession({ req, res });

  if (!session) return res.redirect(302, '/login');

  if (typeof client_id !== 'string') throw new Error('Invalid client_id');

  const client = await prisma.oAuthApp.findUniqueOrThrow({ where: { client_id } });

  if (!client) throw new Error('Invalid client_id');

  const authCode = await prisma.oAuthAuthorizationCode.create({
    data: {
      client_id,
      user_id: session.user.id,
      code: generateAccessToken(),
      OAuthAuthorizationScope: {
        createMany: { data: scope.split(',').map((scope: string) => ({ scope })) },
      },
    },
  });

  const url = new URL(redirect_uri);
  url.searchParams.append('state', state);
  url.searchParams.append('code', authCode.code);

  return res.redirect(302, url.toString());
}
