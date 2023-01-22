import { Status } from "@prisma/client";
import { atom } from "recoil";

export const statusFilterState = atom<{
  [key in Status]: boolean;
}>({
  key: "stateFilterState",
  default: {
    AUCTION: true,
    PURCHASED: true,
    PROGRESS: true,
    AUCTION_OFF: true,
  },
});
