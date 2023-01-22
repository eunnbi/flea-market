import React, { createContext } from "react";

export const tokenContext = createContext<Token>("");
const TokenProvider = ({
  children,
  token,
}: React.PropsWithChildren<{ token: Token }>) => {
  return (
    <tokenContext.Provider value={token}>{children}</tokenContext.Provider>
  );
};

export default TokenProvider;
