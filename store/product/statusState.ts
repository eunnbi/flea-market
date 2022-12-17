import { atom } from "recoil";

export const statusState = atom<ProductItem["status"]>({
  key: "statusState",
  default: "PROGRESS",
});
