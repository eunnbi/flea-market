import type { PrismaClient, User, Product, Wish, Bidding, Image } from '@prisma/client';

declare global {
   var prisma: PrismaClient;
   interface Window {
      kakao: any;
   }
   type MemberTableState = Pick<User, 'userId' | 'firstName' | 'lastName' | 'role'>;
   interface ProductItem extends Product {
      image: Image;
      wish: Wish;
      bid: Bidding[];
    }
}