import { createProduct, getAllProducts, getProductById, getProductBySeller } from '@db/product';
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
      case 'GET': {
        if (req.query.id) {
          const product = await getProductById(req.query.id as string);
          return res.status(200).json(product);
        } else if (req.query.sellerId) {
          const product = await getProductBySeller(req.query.sellerId as string);
          return res.status(200).json(product);
        } else {
          const products = await getAllProducts();

          return res.json(products);
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
