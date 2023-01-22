import { atom } from "recoil";
import { LoginRequest } from "types/auth";

export const loginFormState = atom<LoginRequest>({
  key: "loginFormState",
  default: {
    userId: "",
    password: "",
  },
});
