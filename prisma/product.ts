import { Product, Wish } from "@prisma/client";
import {
  ProductDetailResponse,
  ProductItem,
  ProductsGetResponse,
} from "types/product";
import { getBidCnt, getBiddingList, getBidMaxPrice } from "./bidding";
import { getProductImageUrl } from "./image";
import prisma from "./prisma";
import { getProductRating, getSellerRating } from "./rating";
import { createShopping } from "./shopping";
import { getUserById } from "./user";
import { getIsLike, getLikeCnt } from "./wishlist";

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
  | "name"
  | "price"
  | "imageId"
  | "phoneNumber"
  | "endingAt"
  | "status"
  | "sellerId"
  | "tradingPlace"
  | "content"
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

export const getAllProducts = async (
  userId?: Wish["buyerId"]
): Promise<ProductsGetResponse> => {
  const products = await prisma.product.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      createdAt: true,
      status: true,
      imageId: true,
      sellerId: true,
    },
  });
  const res = await Promise.all(
    products.map(async (product) => {
      const likeCnt = await getLikeCnt(product.id);
      const imageUrl = await getProductImageUrl(product.imageId);
      let isLike = undefined;
      if (userId) {
        isLike = await getIsLike({
          productId: product.id,
          buyerId: userId,
        });
      }
      let bidding;
      if (product.status === "AUCTION") {
        const bidCnt = await getBidCnt(product.id);
        const maxPrice = await getBidMaxPrice(product.id);
        bidding = {
          cnt: bidCnt,
          maxPrice,
        };
      }
      return {
        ...product,
        likeCnt,
        isLike,
        imageUrl,
        bidding,
      };
    })
  );
  return res;
};

export const getProductById = async (id: Product["id"]) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      status: true,
      tradingPlace: true,
      phoneNumber: true,
      content: true,
      imageId: true,
    },
  });
  const imageUrl = await getProductImageUrl(product!.imageId);
  return {
    ...product!,
    imageUrl,
  };
};

export const getProductDetails = async (
  id: Product["id"],
  buyerId?: Wish["buyerId"]
): Promise<ProductDetailResponse> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      status: true,
      tradingPlace: true,
      phoneNumber: true,
      content: true,
      imageId: true,
      sellerId: true,
    },
  });
  const likeCnt = await getLikeCnt(product!.id);
  const imageUrl = await getProductImageUrl(product!.imageId);
  const seller = await getUserById(product!.sellerId);
  const rating = await getSellerRating(seller!.id);
  const bidding = await getBiddingList(product!.id);
  const productRating = await getProductRating(product!.id);
  let isLike = undefined;
  if (buyerId) {
    isLike = await getIsLike({
      productId: product!.id,
      buyerId,
    });
  }
  return {
    ...product!,
    likeCnt,
    isLike,
    imageUrl,
    seller: {
      id: seller!.id,
      name: `${seller!.firstName} ${seller!.lastName}`,
      rating,
    },
    bidding,
    rating: productRating,
  };
};

export const getWishItemInfo = async (
  id: Wish["productId"]
): Promise<ProductItem> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      status: true,
      imageId: true,
      createdAt: true,
    },
  });
  const imageUrl = await getProductImageUrl(product!.imageId);
  const likeCnt = await getLikeCnt(product!.id);
  let bidding;
  if (product!.status === "AUCTION") {
    const bidCnt = await getBidCnt(product!.id);
    const maxPrice = await getBidMaxPrice(product!.id);
    bidding = {
      cnt: bidCnt,
      maxPrice,
    };
  }
  return {
    ...product!,
    imageUrl,
    likeCnt,
    bidding,
  };
};

export const getProductBySeller = async (
  sellerId: Product["sellerId"]
): Promise<ProductsGetResponse> => {
  const products = await prisma.product.findMany({
    where: { sellerId },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      createdAt: true,
      status: true,
      imageId: true,
    },
  });
  const res = await Promise.all(
    products.map(async (product) => {
      const likeCnt = await getLikeCnt(product.id);
      const imageUrl = await getProductImageUrl(product.imageId);
      let bidding;
      if (product.status === "AUCTION") {
        const bidCnt = await getBidCnt(product.id);
        const maxPrice = await getBidMaxPrice(product.id);
        bidding = {
          cnt: bidCnt,
          maxPrice,
        };
      }
      return {
        ...product,
        likeCnt,
        imageUrl,
        bidding,
      };
    })
  );
  return res;
};

export const getProductsByName = async (
  name: Product["name"],
  userId: Wish["buyerId"]
): Promise<ProductsGetResponse> => {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      endingAt: true,
      createdAt: true,
      status: true,
      imageId: true,
      sellerId: true,
    },
  });
  const res = await Promise.all(
    products.map(async (product) => {
      const likeCnt = await getLikeCnt(product.id);
      const imageUrl = await getProductImageUrl(product.imageId);
      let isLike = await getIsLike({
        productId: product.id,
        buyerId: userId,
      });
      let bidding;
      if (product.status === "AUCTION") {
        const bidCnt = await getBidCnt(product.id);
        const maxPrice = await getBidMaxPrice(product.id);
        bidding = {
          cnt: bidCnt,
          maxPrice,
        };
      }
      return {
        ...product,
        likeCnt,
        isLike,
        imageUrl,
        bidding,
      };
    })
  );
  return res;
};

export const deleteProduct = async (id: Product["id"]) => {
  const res = await prisma.product.delete({
    where: {
      id,
    },
  });
  return res;
};

export const deleteProductsBySeller = async (sellerId: Product["sellerId"]) => {
  const res = await prisma.product.deleteMany({
    where: { sellerId },
  });
  return res;
};

export const updateProduct = async (
  id: Product["id"],
  updateData: Partial<Product>
) => {
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
      status: "AUCTION",
    },
  });
  products.forEach(async (product) => {
    const bidding = await getBiddingList(product.id);
    if (bidding.length !== 0) {
      const buyerId = bidding[0].userId!;
      await createShopping({
        price: bidding[0].price,
        buyerId,
        productId: product.id,
        sellerId: product.sellerId,
      });
      await updateProduct(product.id, {
        status: "PURCHASED",
        price: bidding[0].price,
      });
    } else {
      updateProduct(product.id, {
        status: "AUCTION_OFF",
      });
    }
  });
};
