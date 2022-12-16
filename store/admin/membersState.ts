import { User } from "@prisma/client";
import { atom } from "recoil";

export const membersState = atom<User[]>({
    key: "membersState",
    default: []
})