import { atom } from "recoil";

export const modalState = atom<{
  Component: ((props: any) => JSX.Element) | null;
  props: object;
}>({
  key: "modalState",
  default: {
    Component: null,
    props: {},
  },
});
