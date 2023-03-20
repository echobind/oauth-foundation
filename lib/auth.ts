import { NextApiRequest } from 'next';

import { prisma } from '@/lib/prisma';

export async function authenticateToken(req: NextApiRequest) {
  const authToken = req.headers.authorization?.replace(/bearer /gi, '');

  if (!authToken) throw new Error('Authorization header is required');

  const token = await prisma.oAuthAccessToken.findUnique({
    where: { access_token: authToken },
    include: { User: true },
  });

  if (!token) throw new Error('Invalid auth token');

  return token.User;
}
