import { atom } from "recoil";

export const productInputState = atom({
  key: "productInputState",
  default: {
    name: "",
    phoneNumber: "",
    price: "",
    tradingPlace: "",
    content: "",
  },
});
