import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers, getUserById, updateUser } from '@db/user';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id) {
          // Get a single user if id is provided is the query
          // api/users?id=1
          const user = await getUserById(req.query.id as string);
          return res.status(200).json(user);
        } else {
          // Otherwise, fetch all users
          const users = await getAllUsers();
          return res.json(users);
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
