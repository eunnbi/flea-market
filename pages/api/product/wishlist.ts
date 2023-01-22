import { updateAuctionProduct } from "@db/product";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createWish, deleteWish, getWishList } from "@db/wishlist";

const KEY = String(process.env.JSON_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST": {
        if (!req.headers.authorization) {
          return res
            .status(200)
            .json({ success: false, message: "No Access Token" });
        } else {
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, KEY);
          const { id }: User = decoded as User;
          const { productId, wish } = req.body;
          if (wish) {
            await createWish({
              productId,
              buyerId: id,
            });
            return res.status(200).json({ success: true });
          } else {
            const wish = await deleteWish({
              productId,
              buyerId: id,
            });
            if (wish === null) {
              return res.status(200).json({ success: false });
            } else {
              return res.status(200).json({ success: true });
            }
          }
        }
      }
      case "GET": {
        if (!req.headers.authorization) {
          return res
            .status(200)
            .json({ success: false, message: "No Access Token" });
        } else {
          await updateAuctionProduct();
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, KEY);
          const { id }: User = decoded as User;
          const wish = await getWishList(id);
          return res.status(200).json(wish);
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
