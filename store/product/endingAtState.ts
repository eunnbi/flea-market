import dayjs from "dayjs";
import { atom } from "recoil";

const today = new Date();

export const endingAtState = atom({
  key: "endingDateState",
  default: dayjs(
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 00:00:00`
  ),
});
