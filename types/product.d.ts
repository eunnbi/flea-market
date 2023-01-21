import { Bidding, Product, Rating, Shopping, Wish } from "@prisma/client";

declare type ProductCreateRequest = Pick<
  Product,
  | "name"
  | "content"
  | "price"
  | "tradingPlace"
  | "phoneNumber"
  | "status"
  | "endingAt"
  | "imageId"
>;
declare type ProductCreateResponse = SuccessResponse & {
  productId: Product["id"];
};

declare type ProductUpdateRequest = Partial<ProductCreateRequest>;
declare type ProductUpdateResponse = ProductCreateResponse;

declare type ProductDeleteResponse = SuccessResponse;

declare type ProductItem = Pick<
  Product,
  "id" | "name" | "price" | "endingAt" | "createdAt" | "status" | "imageId"
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

declare type BiddingItem = {
  id: string;
  userId: string;
  price: number;
  createdAt: Date;
};

declare type ProductDetailResponse = Pick<
  Product,
  | "id"
  | "name"
  | "price"
  | "endingAt"
  | "status"
  | "tradingPlace"
  | "phoneNumber"
  | "content"
  | "imageId"
> & {
  likeCnt: number;
  isLike?: boolean;
  imageUrl: string;
  bidding: BiddingItem[];
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  rating: number;
};

declare type ProductGetResponse = Pick<
  Product,
  | "id"
  | "name"
  | "price"
  | "endingAt"
  | "status"
  | "tradingPlace"
  | "phoneNumber"
  | "content"
  | "imageId"
> & {
  imageUrl: string;
};

declare type WishListGetResponse = ProductItem[];
declare type WishUpdateRequest = Pick<Wish, "productId"> & {
  wish: boolean;
};
declare type WishUpdateResponse = SuccessResponse;

declare type BiddingCreateRequest = Pick<Bidding, "productId" | "price">;
declare type BiddingCreateResponse = SuccessResponse;

declare type ShoppingCreateRequest = Pick<Shopping, "productId">;
declare type ShoppingCreateResponse = SuccessResponse;

declare type ShoppingItem = Pick<
  Product,
  "id" | "name" | "price" | "tradingPlace"
> & {
  rating: number;
  imageUrl: string;
  seller: {
    id: string;
    name: string;
  };
};
declare type ShoppingListResponse = {
  date: Date;
  list: ShoppingItem[];
}[];

declare type RatingCreateRequest = Pick<Rating, "productId" | "rating">;
declare type RatingCreateResponse = SuccessResponse;
declare type RatingUpdateRequest = Pick<Rating, "productId" | "rating">;
declare type RatingUpdateResponse = SuccessResponse;
