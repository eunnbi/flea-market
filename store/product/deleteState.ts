import { atom } from "recoil";

export const productDeleteState = atom({
  key: "productDeleteState",
  default: {
    open: false,
    id: "",
  },
});
