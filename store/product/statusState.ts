import { atom } from "recoil";

export const productStatusState = atom<ProductItem["status"]>({
  key: "statusState",
  default: "PROGRESS",
});
