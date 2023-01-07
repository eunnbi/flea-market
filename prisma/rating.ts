import { Rating } from "@prisma/client";

export const getSellerRating = async (sellerId: Rating["sellerId"]) => {
  const res = await prisma.rating.findMany({
    where: { sellerId },
    select: { rating: true },
  });
  if (res.length === 0) return 0;
  const rating = res.reduce((acc, cur) => acc + cur.rating, 0) / res.length;
  return Number(rating.toFixed(1));
};

export const getProductRating = async (productId: Rating["productId"]) => {
  const res = await prisma.rating.findFirst({
    where: { productId },
    select: { rating: true },
  });
  return res === null ? 0 : res.rating;
};

export const createRating = async ({
  productId,
  sellerId,
  rating,
}: Omit<Rating, "id">) => {
  const res = await prisma.rating.create({
    data: {
      productId,
      sellerId,
      rating,
    },
  });
  return res;
};

export const updateRating = async ({
  productId,
  rating,
}: Pick<Rating, "productId" | "rating">) => {
  const res = await prisma.rating.update({
    where: {
      productId,
    },
    data: {
      rating,
    },
  });
  return res;
};
