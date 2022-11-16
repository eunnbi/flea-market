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

export default function App({ Component, pageProps }: AppProps) {
  const { id, query } = pageProps;
  const { login } = query;
  return (
    <ThemeProvider theme={theme}>
      <Header isLogin={id} />
      <Component {...pageProps} />
      {!id && login && <LoginForm />}
    </ThemeProvider>
  );
}

App.getInitialProps = async ({ ctx, Component }: AppContext) => {
  const { id } = cookies(ctx);
  console.log(id);
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
