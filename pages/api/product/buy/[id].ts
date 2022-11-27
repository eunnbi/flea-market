import { NextApiRequest, NextApiResponse } from 'next';
import { updateShopping } from '@db/shopping';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PATCH': {
        const { id } = req.query;
        const shopping = await updateShopping(id as string, req.body);
        return res.json(shopping);
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
