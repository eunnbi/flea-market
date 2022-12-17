import { noError } from "@lib/createErrorObject";
import { atom } from "recoil";

export const errorInfoState = atom({
  key: "errorInfoState",
  default: {
    name: noError,
    phoneNumber: noError,
    price: noError,
    tradingPlace: noError,
    imageFile: noError,
    content: noError,
  },
});
