import { Product } from "@prisma/client";

declare type ProductItem = Pick<
  Product,
  "id" | "name" | "price" | "endingAt" | "createdAt" | "status"
> & {
  likeCnt: number;
  imageUrl: string;
  isLike?: boolean;
  bidding?: {
    cnt: number;
    maxPrice?: number;
  };
  sellerId?: string;
};

declare type ProductsGetResponse = ProductItem[];
declare type WishListGetResponse = ProductItem[];
