import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const KEY = String(process.env.JSON_KEY);

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        if (!req.headers.authorization) {
          return res.json({ verify: false, user: undefined });
        } else {
          const token = req.headers.authorization.split(' ')[1];
          if (token) {
            const decoded = jwt.verify(token, KEY);
            const user: User = decoded as User;
            return res.status(200).json({ verify: true, user });
          } else {
            return res.json({ verify: false, user: undefined });
          }
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message, verify: false });
  }
}
