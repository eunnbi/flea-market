import { User } from "@prisma/client";
import prisma from "./prisma";

// READ
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export const getUserById = async (id: User["id"]) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const getUserByUserId = async (userId: User["userId"]) => {
  const user = await prisma.user.findUnique({
    where: { userId },
  });
  return user;
};

export const getUserByLogin = async ({
  userId,
  password,
}: Pick<User, "userId" | "password">) => {
  const user = await prisma.user.findFirst({
    where: {
      userId,
      password,
    },
  });
  return user;
};

export const getUsersByRole = async (role: User["role"]) => {
  const users = await prisma.user.findMany({
    where: { role },
  });
  if (role === "SELLER") {
    const res = await Promise.all(
      users.map((user) => {
        return getSellerWithRating(user);
      })
    );
    return res;
  }
  return users;
};

const getSellerWithRating = async (user: User) => {
  const res = await prisma.shopping.findMany({
    where: { sellerId: user.userId },
    select: { rating: true },
  });
  if (res.length === 0) return { ...user, rating: 0 };
  const rating = res.reduce((acc, cur) => acc + cur.rating, 0) / res.length;
  return { ...user, rating: rating.toFixed(1) };
};

// CREATE
export const createUser = async ({
  firstName,
  lastName,
  userId,
  password,
  role,
}: Pick<User, "firstName" | "lastName" | "userId" | "password" | "role">) => {
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      userId,
      password,
      role,
    },
  });
  return user;
};

// UPDATE
export const updateUser = async (id: User["id"], updateData: Partial<User>) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...updateData,
    },
  });
  return user;
};

// DELETE
export const deleteUser = async (id: User["id"]) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};
