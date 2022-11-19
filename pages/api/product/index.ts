import { createProduct } from '@db/product';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const cookie = req.cookies['id'];
        if (cookie === undefined) {
          return res.status(200).json({ success: false, message: "There's no cookie" });
        }

        const product = await createProduct({ ...req.body, sellerId: cookie });
        return res.status(200).json({ success: true, product });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
