import { User } from "@prisma/client";

declare interface IdDuplicateRequest {
  userId: string;
}
declare interface IdDuplicateResponse {
  idDuplicate: boolean;
}

declare type RegisterRequest = Omit<User, "createdAt" | "id">;
declare type RegisterResponse = SuccessResponse;

declare type LoginRequest = Pick<User, "userId" | "password">;
declare type LoginResponse = SuccessResponse & {
  user: User;
};

declare type LogoutResponse = SuccessResponse;
