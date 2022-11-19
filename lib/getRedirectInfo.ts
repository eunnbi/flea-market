import { User } from '@prisma/client';

export const getRedirectInfo = (url: string, role: User['role']) => {
  const page = url.split('/')[1];
  if (role === 'ADMIN' && page !== 'admin') {
    return {
      destination: '/admin',
    };
  } else if (role === 'SELLER' && page !== 'sell') {
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
