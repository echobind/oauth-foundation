import type { NextApiRequest, NextApiResponse } from 'next';

import { authenticateToken } from '@/lib/auth';

export default async function testTranslation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authenticateToken(req);

    if (!user) throw new Error('User not found.');

    return res.json({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: 'Unknown error.' });
  }
}
