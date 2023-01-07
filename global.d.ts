import type {
  PrismaClient,
  User,
  Product,
  Wish,
  Bidding,
  Image,
  Shopping,
} from "@prisma/client";

declare global {
  var prisma: PrismaClient;
  interface Window {
    kakao: any;
  }
  interface ShoppingItem {
    item: Shopping;
    product: ProductItem & {
      user: User;
    };
  }
}
