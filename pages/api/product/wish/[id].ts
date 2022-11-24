import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById, updateProduct } from '@db/product';
import { createWish, deleteWish } from '@db/wish';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const KEY = String(process.env.JSON_KEY);

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        const { id } = req.query;
        if (!req.headers.authorization) {
          return res.status(200).json({ success: false, message: 'No Access Token' });
        } else {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, KEY);
          const { userId }: User = decoded as User;
          const wish = await deleteWish({ productId: id as string, buyerId: userId });
          if (wish === null) {
            return res.status(200).json({ success: false });
          } else {
            const info = await getProductById(id as string);
            if (info.likeCnt === undefined) {
              return res.status(200).json({ success: false });
            } else {
              const product = await updateProduct(id as string, { likeCnt: info.likeCnt - 1 });
              return res.status(200).json({ success: true, product, wish });
            }
          }
        }
      }
      case 'POST': {
        const { id } = req.query;
        if (!req.headers.authorization) {
          return res.status(200).json({ success: false, message: 'No Access Token' });
        } else {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, KEY);
          const { userId }: User = decoded as User;
          const wish = await createWish({ productId: id as string, buyerId: userId });
          const info = await getProductById(id as string);
          if (info.likeCnt === undefined) {
            return res.status(200).json({ success: false });
          } else {
            const product = await updateProduct(id as string, { likeCnt: info.likeCnt + 1 });
            return res.status(200).json({ success: true, product, wish });
          }
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
