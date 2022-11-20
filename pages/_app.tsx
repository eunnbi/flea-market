import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material';
import { theme } from 'styles/theme';
import cookies from 'next-cookies';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { User } from '@prisma/client';
import { getRedirectInfo } from '@lib/getRedirectInfo';
import Header from '@components/common/Header';
import LoginForm from '@components/LoginForm';
import { useEffect } from 'react';
import Router from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const { id, query, pathname } = pageProps;
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
    <ThemeProvider theme={theme}>
      <Header isLogin={id} />
      <Component {...pageProps} />
      {!id && query && query.login && <LoginForm />}
    </ThemeProvider>
  );
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  const { id } = cookies(ctx);
  const baseUrl = ctx.req ? getAbsoluteUrl(ctx.req) : '';
  if (id) {
    const response = await fetch(`${baseUrl}/api/user?id=${id}`, {
      method: 'GET',
    });
    const user: User = await response.json();
    const info = getRedirectInfo(ctx.pathname, user.role);
    console.log(ctx.pathname, info, user.role);
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
      id,
    },
  };
};
