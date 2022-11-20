import { Image } from '@prisma/client';
import prisma from './prisma';
export const createImage = async ({ publicId, version, format }: Pick<Image, 'format' | 'publicId' | 'version'>) => {
  const res = await prisma.image.create({
    data: {
      publicId,
      version,
      format,
    },
  });
  return res;
};

export const getImageById = async (id: Image['id']) => {
  const res = await prisma.image.findUnique({
    where: { id },
  });
  return res;
};
