import { Bidding } from "@prisma/client";
import { BiddingItem } from "types/product";
import prisma from "./prisma";

export const createBidding = async ({
  bidderId,
  price,
  productId,
}: Pick<Bidding, "bidderId" | "price" | "productId">) => {
  const res = await prisma.bidding.create({
    data: {
      bidderId,
      price,
      productId,
    },
  });
  return res;
};

export const getBiddingList = async (
  productId: Bidding["productId"]
): Promise<BiddingItem[]> => {
  const biddingList = await prisma.bidding.findMany({
    where: { productId },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      price: true,
      createdAt: true,
      bidderId: true,
    },
  });
  const res = await Promise.all(
    biddingList.map(async (bid) => {
      const user = await prisma.user.findUnique({
        where: { id: bid.bidderId },
      });
      return {
        id: bid.id,
        price: bid.price,
        createdAt: bid.createdAt,
        userId: user!.userId,
      };
    })
  );
  return res;
};

export const deleteBiddingByProduct = async (
  productId: Bidding["productId"]
) => {
  const res = await prisma.bidding.deleteMany({
    where: { productId },
  });
  return res;
};

export const deleteBiddingByUser = async (bidderId: Bidding["bidderId"]) => {
  const res = await prisma.bidding.deleteMany({
    where: { bidderId },
  });
  return res;
};

export const getBidCnt = async (productId: Bidding["productId"]) => {
  const res = await prisma.bidding.findMany({
    where: {
      productId,
    },
  });
  return res.length;
};

export const getBidMaxPrice = async (
  productId: Bidding["productId"]
): Promise<number | undefined> => {
  const bidding = await prisma.bidding.findMany({
    where: { productId },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return bidding.length === 0 ? undefined : bidding[0].price;
};
