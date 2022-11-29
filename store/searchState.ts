import { atom, selector } from 'recoil';

export const searchState = atom({
  key: 'searchState',
  default: {
    name: '',
    seller: {
      id: '',
      name: '',
    },
    startPrice: 0,
    lastPrice: 0,
  },
});

export const searchInputState = atom({
  key: 'searchInputState',
  default: '',
});
