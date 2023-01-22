import { tokenContext } from "@context/TokenProvider";
import { useContext } from "react";

export const useToken = () => {
  return useContext(tokenContext);
};
