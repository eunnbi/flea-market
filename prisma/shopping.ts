import { Shopping } from "@prisma/client";
import { ShoppingListResponse } from "types/product";
import { getProductImageUrl } from "./image";
import prisma from "./prisma";
import { getProductRating } from "./rating";
import { getUserById } from "./user";

export const createShopping = async ({
  price,
  buyerId,
  productId,
  sellerId,
}: Pick<Shopping, "buyerId" | "price" | "productId" | "sellerId">) => {
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

export const getShoppingList = async (
  buyerId: Shopping["buyerId"]
): Promise<ShoppingListResponse> => {
  const shopping = await prisma.shopping.findMany({
    where: { buyerId },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  const dates = [...new Set(shopping.map(({ createdAt }) => createdAt))];
  const res = await Promise.all(
    dates.map(async (date) => {
      const list = await Promise.all(
        shopping
          .filter(({ createdAt }) => createdAt === date)
          .map(async ({ productId, sellerId }) => {
            const product = await prisma.product.findUnique({
              where: {
                id: productId,
              },
              select: {
                id: true,
                name: true,
                price: true,
                tradingPlace: true,
                imageId: true,
              },
            });
            const seller = await getUserById(sellerId);
            const imageUrl = await getProductImageUrl(product!.imageId);
            const rating = await getProductRating(productId);
            return {
              ...product!,
              imageUrl,
              rating,
              seller: {
                id: sellerId,
                name: `${seller!.firstName} ${seller!.lastName}`,
              },
            };
          })
      );
      return {
        date,
        list,
      };
    })
  );
  return res;
};

export const deleteShoppingByUser = async (buyerId: Shopping["buyerId"]) => {
  const res = await prisma.shopping.deleteMany({
    where: { buyerId },
  });
  return res;
};

export const deleteShoppingByProduct = async (
  productId: Shopping["productId"]
) => {
  const res = await prisma.shopping.deleteMany({
    where: { productId },
  });
  return res;
};
