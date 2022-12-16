import { atom } from "recoil";

export const statusFilterState = atom({
    key: "stateFilterState",
    default: {
        AUCTION: true,
        PURCHASED: true,
        PROGRESS: true,
    }
})