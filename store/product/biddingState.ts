import { atom } from "recoil";

export const biddingState = atom({
  key: "biddingState",
  default: {
    open: false,
    token: "",
    id: "",
    maxPrice: 0,
  },
});
