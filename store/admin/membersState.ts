import { User } from "@prisma/client";
import { atom } from "recoil";
import { UsersGetResponse } from "types/user";

export const membersState = atom<UsersGetResponse>({
  key: "membersState",
  default: [],
});
