import { atom, selector } from 'recoil';

export const searchState = atom({
  key: 'searchState',
  default: {
    name: '',
    sellerId: '',
    startPrice: 0,
    lastPrice: 0,
  },
});
