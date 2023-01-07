import { NextApiRequest, NextApiResponse } from "next";
import { createRating, updateRating } from "@db/rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST": {
        const { productId, rating } = req.body;
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });
        await createRating({
          rating,
          productId,
          sellerId: product!.sellerId,
        });
        return res.status(200).json({ success: true });
      }
      case "PATCH": {
        const { productId, rating } = req.body;
        await updateRating({
          rating,
          productId,
        });
        return res.status(200).json({ success: true });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
