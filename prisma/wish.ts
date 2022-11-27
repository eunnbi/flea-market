import { Wish } from '@prisma/client';
import prisma from './prisma';
import { getProductById } from './product';

export const createWish = async ({ buyerId, productId }: Pick<Wish, 'buyerId' | 'productId'>) => {
  const res = await prisma.wish.create({
    data: {
      buyerId,
      productId,
    },
  });
  return res;
};

export const deleteWish = async ({ buyerId, productId }: Pick<Wish, 'buyerId' | 'productId'>) => {
  const wish = await prisma.wish.findFirst({
    where: { buyerId, productId },
  });
  if (wish === null) return wish;
  else {
    const res = await prisma.wish.delete({
      where: { id: wish.id },
    });
    return res;
  }
};

export const getWishList = async (buyerId: Wish['buyerId']) => {
  const wish = await prisma.wish.findMany({
    where: { buyerId },
  });
  const res = await Promise.all(
    wish.map(item => {
      return getProductById(item.productId, undefined, false);
    }),
  );
  return res;
};

export const deleteWishByUser = async (buyerId: Wish['buyerId']) => {
  const res = await prisma.wish.deleteMany({
    where: { buyerId },
  });
  return res;
};

export const deleteWishByProduct = async (productId: Wish['productId']) => {
  const res = await prisma.wish.deleteMany({
    where: {
      productId,
    },
  });
  return res;
};

export const getWish = async ({ buyerId, productId }: Pick<Wish, 'buyerId' | 'productId'>) => {
  const res = await prisma.wish.findFirst({
    where: { buyerId, productId },
  });
  return res;
};
