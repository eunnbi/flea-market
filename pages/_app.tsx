import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material';
import { theme } from 'styles/theme';
import cookies from 'next-cookies';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { getRedirectInfo } from '@lib/getRedirectInfo';
import Header from '@components/common/Header';
import LoginForm from '@components/LoginForm';
import { useEffect } from 'react';
import Router from 'next/router';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  const { verify, query, pathname } = pageProps;
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (query && query.alert) {
      timerId = setTimeout(() => {
        alert(query.alert);
        if (query.login) {
          Router.replace(`${pathname}?login=true`, pathname);
        } else {
          Router.replace(pathname);
        }
      }, 1000);
    }
    return () => clearTimeout(timerId);
  }, [query, pathname]);
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Header isLogin={verify} />
        <Component {...pageProps} />
        {!verify && query && query.login && <LoginForm />}
      </ThemeProvider>
    </RecoilRoot>
  );
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  const { access_token } = cookies(ctx);
  const baseUrl = ctx.req ? getAbsoluteUrl(ctx.req) : '';
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const { verify, user } = await response.json();
  if (verify) {
    const info = getRedirectInfo(ctx.pathname, user.role);
    if (info && ctx.res) {
      ctx.res.writeHead(302, { Location: info.destination });
      ctx.res.end();
    }
  } else if ((ctx.pathname === '/sell' || ctx.pathname === '/admin') && ctx.res) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
  }
  return {
    pageProps: {
      pathname: ctx.pathname,
      query: ctx.query,
      verify,
    },
  };
};
