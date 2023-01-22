import "../styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "styles/theme";
import { createContext, useEffect } from "react";
import { RecoilRoot } from "recoil";
import { Modal } from "@components/common/Modal";
import Header from "@components/common/Header";
import axios from "axios";

interface CommonPageProps {
  isLogin: boolean;
  token?: string | null;
}

export const tokenContext = createContext<string | null | undefined>("");

export default function App({
  Component,
  pageProps,
  router,
}: AppProps<CommonPageProps>) {
  const { query, pathname } = router;
  const { isLogin, token } = pageProps;
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (query && query.alert) {
      timerId = setTimeout(() => {
        alert(query.alert);
        if (query.login) {
          router.replace(
            `${window.location.pathname}?login=true`,
            window.location.pathname
          );
        } else {
          router.replace(window.location.pathname);
        }
      }, 1000);
    }
    return () => clearTimeout(timerId);
  }, [query, pathname]);

  axios.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : "";
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <tokenContext.Provider value={token}>
          <Header isLogin={isLogin} pathname={pathname} query={query} />
          <Component {...pageProps} />
          <Modal />
        </tokenContext.Provider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
