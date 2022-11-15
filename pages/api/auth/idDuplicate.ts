import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@db/user';

export default async function idDuplicate(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { userId } = req.query;
        const user = await getUser(userId as string);
        return res.status(200).json({ idDuplicate: user === null ? false : true });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
