import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createBidding } from "@db/bidding";

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
          await createBidding({
            ...req.body,
            bidderId: id,
          });
          return res.status(200).json({ success: true });
        }
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
