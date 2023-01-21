import { getProductDetails, updateAuctionProduct } from "@db/product";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const KEY = String(process.env.JSON_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        await updateAuctionProduct();
        if (req.query.id) {
          if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, KEY);
            const { id }: User = decoded as User;
            const product = await getProductDetails(req.query.id as string, id);
            return res.status(200).json(product);
          } else {
            const product = await getProductDetails(req.query.id as string);
            return res.status(200).json(product);
          }
        } else {
          return res.status(200).json({ success: false, product: null });
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
