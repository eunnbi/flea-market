import { Product, User } from '@prisma/client';
import { getImageById } from './image';
import prisma from './prisma';

export const createProduct = async ({
  name,
  price,
  imageId,
  phoneNumber,
  endingAt,
  status,
  sellerId,
  tradingPlace,
  content,
}: Pick<
  Product,
  'name' | 'price' | 'imageId' | 'phoneNumber' | 'endingAt' | 'status' | 'sellerId' | 'tradingPlace' | 'content'
>) => {
  const res = await prisma.product.create({
    data: {
      name,
      price,
      imageId,
      phoneNumber,
      endingAt,
      status,
      sellerId,
      tradingPlace,
      content,
    },
  });
  return res;
};

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  const res = await Promise.all(
    products.map(product => {
      return getProductWithImage(product);
    }),
  );
  return res;
};

const getProductWithImage = async (product: Product) => {
  const image = await getImageById(product.imageId);
  return { ...product, image };
};

export const getProductById = async (id: Product['id']) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  const image = await prisma.image.findUnique({
    where: { id: product?.imageId },
  });
  const user = await prisma.user.findUnique({
    where: { userId: product?.sellerId },
  });
  return { ...product, image, user };
};

export const getProductBySeller = async (sellerId: Product['sellerId']) => {
  const products = await prisma.product.findMany({
    where: { sellerId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  const res = await Promise.all(
    products.map(product => {
      return getProductWithImage(product);
    }),
  );
  return res;
};

export const getProductsByName = async (name: Product['name']) => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });
  const res = await Promise.all(
    products.map(product => {
      return getProductWithImage(product);
    }),
  );
  return res;
};

export const deleteProduct = async (id: Product['id']) => {
  const res = await prisma.product.delete({
    where: {
      id,
    },
  });
  return res;
};

export const deleteProductsBySeller = async (sellerId: Product['sellerId']) => {
  const res = await prisma.product.deleteMany({
    where: { sellerId },
  });
  return res;
};

export const updateProduct = async (id: Product['id'], updateData: Partial<Product>) => {
  const res = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...updateData,
    },
  });
  return res;
};
