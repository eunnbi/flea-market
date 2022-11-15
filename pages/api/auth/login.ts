import { NextApiRequest, NextApiResponse } from 'next';
import { getUser, getUserByLogin } from '@db/user';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const user = await getUserByLogin(req.body);
        if (user === null) {
          res.status(400).json({ message: 'Wrong ID or password' });
        } else {
          const { id } = user;
          res.setHeader('Set-Cookie', `id=${id}; path=/;`);
          return res.status(200).json({ success: true, user });
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
