// /prisma/user.js
import prisma from './prisma'

// READ
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({})
  return users
}

export const getUser = async (id: User["id"]) => {
  const user = await prisma.user.findUnique({
    where: { id }
  })
  return user
}

// CREATE
export const createUser = async ({email, name, birthYear} : Pick<User, "email" | "name" | "birthYear">) => {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      birthYear
    }
  })
  return user
}

// UPDATE
export const updateUser = async (id: User["id"], updateData : Partial<User>) => {
  const user = await prisma.user.update({
    where: {
      id
    },
    data: {
      ...updateData
    }
  })
  return user
}

// DELETE
export const deleteUser = async (id: User["id"]) => {
  const user = await prisma.user.delete({
    where: {
      id
    }
  })
  return user
}