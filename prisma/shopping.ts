import { Shopping } from '@prisma/client';
import prisma from './prisma';
import { getProductById } from './product';

export const createShopping = async ({
  price,
  buyerId,
  productId,
  sellerId,
}: Pick<Shopping, 'buyerId' | 'price' | 'productId' | 'sellerId'>) => {
  const res = await prisma.shopping.create({
    data: {
      price,
      buyerId,
      productId,
      sellerId,
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

export const deleteShoppingByProduct = async (productId: Shopping['productId']) => {
  const res = await prisma.shopping.deleteMany({
    where: { productId },
  });
  return res;
};

export const updateShopping = async (id: Shopping['id'], data: Partial<Shopping>) => {
  const res = await prisma.shopping.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return res;
};
