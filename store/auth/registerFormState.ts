import { atom } from "recoil";
import { RegisterRequest } from "types/auth";

export const registerFormState = atom<RegisterRequest>({
  key: "registerFormState",
  default: {
    firstName: "",
    lastName: "",
    role: "SELLER",
    userId: "",
    password: "",
  },
});
