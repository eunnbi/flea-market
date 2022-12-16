import { atom } from "recoil";

export const priceState = atom({
  key: "priceState",
  default: {
    startPrice: 0,
    lastPrice: 0,
  },
});
