import { atom } from "recoil";

export const sellerState = atom({
  key: "sellerState",
  default: {
    id: "",
    name: "",
  },
});
