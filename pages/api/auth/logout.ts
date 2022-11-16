import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByLogin } from '@db/user';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        res.setHeader('Set-Cookie', `id=; path=/; expires=-1`);
        return res.status(200).json({ success: true });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
