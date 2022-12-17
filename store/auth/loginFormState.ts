import { atom } from "recoil";

export const loginFormState = atom<LoginFormState>({
  key: "loginFormState",
  default: {
    userId: "",
    password: "",
  },
});
