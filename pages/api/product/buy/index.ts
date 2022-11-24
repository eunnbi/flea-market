import { updateProduct } from '@db/product';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createShopping, getShoppingList } from '@db/shopping';

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
          const shopping = await createShopping({ ...req.body, buyerId: userId });
          const product = await updateProduct(req.body.productId, { status: 'PURCHASED' });
          return res.status(200).json({ success: true, product, shopping });
        }
      }
      case 'GET': {
        if (!req.headers.authorization) {
          return res.status(200).json({ success: false, message: 'No Access Token' });
        } else {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, KEY);
          const { userId }: User = decoded as User;
          const shopping = await getShoppingList(userId);
          return res.status(200).json(shopping);
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
