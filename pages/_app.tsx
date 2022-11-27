import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material';
import { theme } from 'styles/theme';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import Footer from '@components/common/Footer';

export default function App({ Component, pageProps, router }: AppProps) {
  const { query, pathname } = router;
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (query && query.alert) {
      timerId = setTimeout(() => {
        alert(query.alert);
        if (query.login) {
          router.replace(`${window.location.pathname}?login=true`, window.location.pathname);
        } else {
          router.replace(window.location.pathname);
        }
      }, 1000);
    }
    return () => clearTimeout(timerId);
  }, [query, pathname]);
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </RecoilRoot>
  );
}
