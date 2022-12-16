import { atom } from "recoil";

export const sortFilterState = atom<"최신순" | "좋아요순">({
    key: "sortFilterState",
    default: '최신순'
})