import { atom } from "recoil";

export const ratingState = atom({
  key: "ratingState",
  default: {
    open: false,
    initialRating: 0,
    id: "",
  },
});
