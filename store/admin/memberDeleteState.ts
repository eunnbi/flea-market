import { atom } from "recoil";

export const memberDeleteState = atom({
    key: "memberDeleteState",
    default: {
        open: false,
        id: ''
    }
})