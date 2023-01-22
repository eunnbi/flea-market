import { tokenContext } from "pages/_app";
import { useContext } from "react";

export const useToken = () => {
  return useContext(tokenContext);
};
