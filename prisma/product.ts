import { Product, Wish } from '@prisma/client';
import { getBidding } from './bidding';
import { getImageById } from './image';
import prisma from './prisma';
import { createShopping } from './shopping';
import { getWish } from './wish';

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

export const getAllProducts = async (userId?: Wish['buyerId']) => {
  const products = await prisma.product.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  const res = await Promise.all(
    products.map(product => {
      return getProduct(product, userId);
    }),
  );
  return res;
};

const getProduct = async (product: Product, userId?: Wish['buyerId']) => {
  const image = await getImageById(product.imageId);
  const bid = await getBidding(product.id);
  if (userId) {
    const wish = await getWish({ productId: product.id, buyerId: userId });
    return { ...product, image, bid, wish };
  }
  return { ...product, image, bid };
};

export const getProductById = async (id: Product['id'], buyerId?: Wish['buyerId'], withSeller: boolean = true) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  const image = await prisma.image.findUnique({
    where: { id: product?.imageId },
  });
  const ratings = await prisma.shopping.findMany({
    where: { productId: product?.id },
    select: {
      rating: true,
    },
  });
  const rating = ratings.length === 0 ? 0 : ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length;
  //@ts-ignore
  product['rating'] = rating.toFixed(1);
  const bid = await getBidding(product!.id);
  if (withSeller) {
    const user = await prisma.user.findUnique({
      where: { userId: product?.sellerId },
    });
    const data = await prisma.shopping.findMany({
      where: { sellerId: user?.userId },
      select: { rating: true },
    });
    if (user != null) {
      if (data.length === 0) {
        // @ts-ignore
        user['rating'] = 0;
      } else {
        const totalRating = data.reduce((acc, cur) => acc + cur.rating, 0) / data.length;
        if (user !== null) {
          // @ts-ignore
          user['rating'] = totalRating.toFixed(1);
        }
      }
    }

    if (buyerId) {
      const wish = await prisma.wish.findFirst({
        where: { productId: product?.id, buyerId },
      });
      return { ...product, image, user, wish, bid };
    } else {
      return { ...product, image, user, bid };
    }
  } else {
    if (buyerId) {
      const wish = await prisma.wish.findFirst({
        where: { productId: product?.id, buyerId },
      });
      return { ...product, image, wish, bid };
    } else {
      return { ...product, image, bid };
    }
  }
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
      return getProduct(product);
    }),
  );
  return res;
};

export const getProductsByName = async (name: Product['name'], userId?: Wish['buyerId']) => {
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
      return getProduct(product, userId);
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

export const updateAuctionProduct = async () => {
  const today = new Date();
  const products = await prisma.product.findMany({
    where: {
      endingAt: {
        lte: today.toISOString(),
      },
      status: 'AUCTION',
    },
  });
  products.forEach(async product => {
    const bidding = await getBidding(product.id);
    if (bidding.length !== 0) {
      const buyerId = bidding[0].userId!;
      await createShopping({ price: bidding[0].price, buyerId, productId: product.id, sellerId: product.sellerId });
      await updateProduct(product.id, { status: 'PURCHASED', price: bidding[0].price });
    } else {
    }
  });
};
