import { createImage } from '@db/image';
import { NextApiRequest, NextApiResponse } from 'next';

//@ts-ignore
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const image = await createImage(req.body);
        return res.status(200).json({ success: true, image });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
