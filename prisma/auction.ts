import { Bidding } from '@prisma/client';
import prisma from './prisma';

export const createBidding = async ({
  bidderId,
  price,
  productId,
}: Pick<Bidding, 'bidderId' | 'price' | 'productId'>) => {
  const res = await prisma.bidding.create({
    data: {
      bidderId,
      price,
      productId,
    },
  });
  return res;
};

export const getBiddingByProductId = async (productId: Bidding['productId']) => {
  const bidding = await prisma.bidding.findMany({
    where: { productId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  const res = await Promise.all(
    bidding.map(async bid => {
      const user = await prisma.user.findUnique({
        where: { userId: bid.bidderId },
      });
      return { ...bid, ...user };
    }),
  );
  return res;
};
