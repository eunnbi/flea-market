import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySeller,
  getProductsByName,
  updateAuctionProduct,
} from '@db/product';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const KEY = String(process.env.JSON_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        if (!req.headers.authorization) {
          return res.status(200).json({ success: false, message: 'No Access Token' });
        } else {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, KEY);
          const { userId }: User = decoded as User;
          const product = await createProduct({ ...req.body, sellerId: userId });
          return res.status(200).json({ success: true, product });
        }
      }
      case 'GET': {
        await updateAuctionProduct();
        if (req.query.id) {
          if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, KEY);
            const { userId }: User = decoded as User;
            const product = await getProductById(req.query.id as string, userId);
            return res.status(200).json(product);
          } else {
            const product = await getProductById(req.query.id as string);
            return res.status(200).json(product);
          }
        } else if (req.query.name) {
          if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, KEY);
            const { userId }: User = decoded as User;
            const products = await getProductsByName(req.query.name as string, userId);
            return res.status(200).json(products);
          } else {
            const products = await getProductsByName(req.query.id as string);
            return res.status(200).json(products);
          }
        } else if (req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, KEY);
          const { userId, role }: User = decoded as User;
          if (role === 'SELLER') {
            const product = await getProductBySeller(userId);
            return res.status(200).json(product);
          } else {
            const products = await getAllProducts(userId);
            return res.status(200).json(products);
          }
        } else {
          const products = await getAllProducts();
          return res.status(200).json(products);
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
