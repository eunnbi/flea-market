import { User, Rating } from "@prisma/client";

declare type UsersGetResponse = Omit<User, "password">[];

declare type UserPatchResquest = Pick<
  User,
  "userId" | "firstName" | "lastName" | "role"
>;
declare type UserPatchResponse = SuccessResponse;

declare type UserDeleteResponse = SuccessResponse;

declare type UserVerifyResponse = {
  verify: boolean;
  user: Omit<User, "id" | "password"> | null;
};

declare type SellersGetResponse = (Pick<
  User,
  "id" | "firstName" | "lastName" | "userId"
> &
  Pick<Rating, "rating">)[];
