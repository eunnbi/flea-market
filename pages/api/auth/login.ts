import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByLogin } from '@db/user';
import jwt from 'jsonwebtoken';

const KEY = String(process.env.JSON_KEY);

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const user = await getUserByLogin(req.body);
        if (user === null) {
          res.status(200).json({ message: 'Wrong ID or password' });
        } else {
          const { firstName, lastName, userId, role, createdAt } = user;
          const payload = {
            userId,
            firstName,
            lastName,
            role,
            createdAt,
          };
          const token = jwt.sign(payload, KEY, {
            expiresIn: 31556926,
          });
          res.setHeader('Set-Cookie', `access_token=${token}; path=/; Secure;`);
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
