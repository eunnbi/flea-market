import { Rating } from "@prisma/client";

export const getSellerRating = async (sellerId: Rating["sellerId"]) => {
  const res = await prisma.rating.findMany({
    where: { sellerId },
    select: { rating: true },
  });
  if (res.length === 0) return 0;
  const rating = res.reduce((acc, cur) => acc + cur.rating, 0) / res.length;
  return rating.toFixed(1);
};
