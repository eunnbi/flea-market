import { atom } from "recoil";

export const registerFormState = atom<RegisterFormState>({
  key: "registerFormState",
  default: {
    firstName: "",
    lastName: "",
    role: "SELLER",
    userId: "",
    password: "",
  },
});
