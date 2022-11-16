import { User } from '@prisma/client';

export const getRedirectInfo = (url: string, role: User['role']) => {
  if (role === 'ADMIN' && url !== '/admin') {
    return {
      destination: '/admin',
    };
  } else if (role === 'SELLER' && url !== '/sell') {
    return {
      destination: '/sell',
    };
  } else if (role === 'BUYER' && url !== '/') {
    return {
      destination: '/',
    };
  }
  return;
};
