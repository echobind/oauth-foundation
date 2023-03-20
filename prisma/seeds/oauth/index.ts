import { prisma } from '@/lib/prisma';

export async function oauthSeed() {
  await prisma.oAuthScope.create({
    data: { scope: 'email', description: 'Access your email address.' },
  });

  await prisma.oAuthApp.create({
    data: {
      app_name: 'Testing App',
      client_id: 'test-client',
      client_secret: 'super-secret',
      app_description: 'An app for testing',
      app_homepage_url: 'http://example.com',
      app_icon_url: '',
      OAuthCallbackURL: { create: { callback_url: 'http://example.org/cb' } },
    },
  });
}
