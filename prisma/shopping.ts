import { Shopping } from '@prisma/client';
import prisma from './prisma';
import { getProductById } from './product';

export const createShopping = async ({
  price,
  buyerId,
  productId,
}: Pick<Shopping, 'buyerId' | 'price' | 'productId'>) => {
  const res = await prisma.shopping.create({
    data: {
      price,
      buyerId,
      productId,
    },
  });
  return res;
};

export const getShoppingList = async (buyerId: Shopping['buyerId']) => {
  const shopping = await prisma.shopping.findMany({
    where: { buyerId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  const res = await Promise.all(
    shopping.map(async item => {
      return { item, product: await getProductById(item.productId, undefined) };
    }),
  );
  return res;
};

export const deleteShoppingByUser = async (buyerId: Shopping['buyerId']) => {
  const res = await prisma.shopping.deleteMany({
    where: { buyerId },
  });
  return res;
};
