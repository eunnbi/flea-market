import { User } from "@prisma/client";
import prisma from "./prisma";
import { getSellerRating } from "./rating";

// READ
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      userId: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });
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
    select: {
      id: true,
      userId: true,
      firstName: true,
      lastName: true,
    },
  });
  if (role === "SELLER") {
    const res = await Promise.all(
      users.map(async (user) => {
        const rating = await getSellerRating(user.id);
        return { ...user, rating };
      })
    );
    return res;
  }
  return users;
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
