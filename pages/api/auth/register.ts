import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@db/user';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        // Create a new user
        const user = await createUser(req.body);
        return res.status(200).json({ success: true, user });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
