import { modalState } from "@store/modalState";
import { useRecoilValue } from "recoil";

export const Modal = () => {
  const { Component, props } = useRecoilValue(modalState);
  return Component ? <Component {...props} /> : null;
};
