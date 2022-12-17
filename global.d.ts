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
  type MemberTableState = Pick<
    User,
    "userId" | "firstName" | "lastName" | "role"
  >;
  interface ProductItem extends Product {
    image: Image;
    wish: Wish;
    bid: Bidding[];
  }
  interface ShoppingItem {
    item: Shopping;
    product: ProductItem & {
      user: User;
    };
  }
  type LoginFormState = Pick<User, "userId" | "password">;
  type RegisterFormState = Pick<
    User,
    "userId" | "password" | "firstName" | "lastName" | "role"
  >;
}
