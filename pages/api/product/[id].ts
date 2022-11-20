import { NextApiRequest, NextApiResponse } from 'next';
import { deleteProduct, updateProduct } from '@db/product';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        // Delete an existing user
        const { id } = req.query;
        const product = await deleteProduct(id as string);
        return res.json(product);
      }
      case 'PATCH': {
        // Update an existing user
        const { id } = req.query;
        const product = await updateProduct(id as string, req.body);
        return res.json(product);
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
