import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '@db/user';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        // Delete an existing user
        const { id } = req.query;
        const user = await deleteUser(id as string);
        return res.json(user);
      }
      case 'PATCH': {
        // Update an existing user
        const { id } = req.query;
        const user = await updateUser(id as string, req.body);
        return res.json(user);
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
