import { atom } from "recoil";

export const buyingState = atom({
  key: "buyingState",
  default: {
    open: false,
    token: "",
    id: "",
    sellerId: "",
    price: 0,
  },
});
