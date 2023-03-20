import crypto from 'crypto';

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { generateAccessToken, hashPassword } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    let body: any;

    try {
      body = await request.json();
    } catch {
      throw new Error('Request body must be valid JSON.');
    }

    const grant_type = body.grant_type as
      | 'authorization_code'
      | 'password'
      | 'client_credentials'
      | 'device_code'
      | null;

    if (!grant_type) throw new Error('grant_type is required.');

    const client_id = body.client_id;
    const client_secret = body.client_secret;

    switch (grant_type) {
      case 'authorization_code': {
        const code = body.code;
        const redirect_uri = body.redirect_uri;
        if (!code) throw new Error('code is required.');

        const authCode = await prisma.oAuthAuthorizationCode.findUnique({
          where: { code },
          select: {
            user_id: true,
            OAuthApp: {
              select: {
                client_id: true,
                client_secret: true,
                OAuthCallbackURL: { select: { callback_url: true } },
              },
            },
            code_challenge: true,
            code_challenge_method: true,
            OAuthAuthorizationScope: { select: { scope: true } },
          },
        });

        console.log(code, authCode);
        if (!authCode) throw new Error('Invalid auth code.');

        if (authCode.code_challenge) {
          const code_verifier = body.code_verifier || '';
          const codeType = authCode.code_challenge_method === 'S256' ? 'sha256' : 'unknown';
          if (codeType === 'unknown') throw new Error('Invalid code challenge method.');

          const hashedCode = crypto.createHash(codeType).update(code_verifier).digest('base64');

          if (hashedCode !== authCode.code_challenge) throw new Error('Invalid code verifier.');
        } else if (
          authCode.OAuthApp?.client_id !== client_id ||
          authCode.OAuthApp?.client_secret !== client_secret
        )
          throw new Error('Invalid client credentials.');
        console.log(authCode.OAuthApp?.OAuthCallbackURL, redirect_uri);
        if (!authCode.OAuthApp?.OAuthCallbackURL.some((url) => url.callback_url === redirect_uri))
          throw new Error('Invalid redirect URI');

        const token = await prisma.oAuthAccessToken.create({
          data: {
            access_token: generateAccessToken(),
            refresh_token: generateAccessToken(),
            client_id,
            user_id: authCode.user_id,
            OAuthAccessTokenScope: {
              createMany: {
                data: authCode.OAuthAuthorizationScope.map((scope) => ({ scope: scope.scope })),
              },
            },
          },
        });

        return NextResponse.json(
          {
            access_token: token.access_token,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: token.refresh_token,
          },
          { headers: { 'cache-control': 'no-store' } }
        );
      }

      case 'password': {
        const username = body.username;
        const password = body.password;
        if (!username) throw new Error('URL param username is required.');
        const user = await prisma.user.findUnique({ where: { email: username } });
        if (!user) throw new Error('Invalid username.');
        const hashedPassword = hashPassword(password || '');
        if (user.password !== hashedPassword) throw new Error('Invalid password.');

        const token = await prisma.oAuthAccessToken.create({
          data: {
            access_token: generateAccessToken(),
            refresh_token: generateAccessToken(),
            client_id,
            user_id: user.id,
            // TODO: Add some kind of default scope
            // OAuthAccessTokenScope: {
            // },
          },
        });

        return NextResponse.json(
          {
            access_token: token.access_token,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: token.refresh_token,
          },
          { headers: { 'cache-control': 'no-store' } }
        );
      }

      case 'device_code':
      case 'client_credentials':
      default:
        return NextResponse.json(
          {
            error: 'unsupported_grant_type',
            message: `grant_type ${grant_type} is not implemented.`,
          },
          { status: 400 }
        );
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'invalid_request', message: 'An unknown error occurred.' },
      { status: 400 }
    );
  }
}
