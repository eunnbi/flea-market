import styled from '@emotion/styled';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import LoginForm from '@components/LoginForm';
import { BiMenu } from 'react-icons/bi';

const getHeaderInfo = (pathname: string, isLogin: boolean) => {
  const page = pathname.split('/')[1];
  if (page === 'admin') {
    return {
      basePath: `/${page}`,
      NAV: [],
    };
  } else if (page === 'sell') {
    return {
      basePath: `/${page}`,
      NAV: [{ to: '/sell/register', name: 'Register Product' }],
    };
  } else {
    return {
      basePath: '/',
      NAV: isLogin
        ? [
            { to: '/products/search', name: 'Search Product' },
            { to: '/mypage/shopping', name: 'Shopping List' },
            { to: '/mypage/wishlist', name: 'Wish List' },
          ]
        : [],
    };
  }
};

const Header = ({ isLogin }: { isLogin: boolean }) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [open, setOpen] = useState(false);
  const { basePath, NAV } = getHeaderInfo(pathname, isLogin);
  const onLogout = () => {
    axios.post('/api/auth/logout').then(() => {
      router.push('/');
    });
  };
  const onToggle = () => setOpen(open => !open);
  return (
    <>
      <HeaderBox>
        <div>
          <div className="row">
            <Link href={basePath}>
              <h1>{basePath === '/admin' ? 'DashBoard' : 'Flea Market'}</h1>
            </Link>
            <IconButton sx={{ color: 'white' }} className="menuBtn" onClick={onToggle}>
              <BiMenu />
            </IconButton>
          </div>
          <Wrapper>
            <Nav>
              {NAV.map((elem, index) => (
                <StyledLink to={elem.to} path={pathname} key={index} href={elem.to}>
                  {elem.name}
                </StyledLink>
              ))}
            </Nav>
            {!isLogin ? (
              <StyledButton
                variant="outlined"
                onClick={() => router.push(`${window.location.pathname}?login=true`, window.location.pathname)}>
                로그인
              </StyledButton>
            ) : (
              <StyledButton variant="outlined" onClick={onLogout}>
                로그아웃
              </StyledButton>
            )}
          </Wrapper>
          <Wrapper className={open ? 'mobile open' : 'mobile'}>
            <Nav>
              {NAV.map((elem, index) => (
                <StyledLink to={elem.to} path={pathname} key={index} href={elem.to}>
                  {elem.name}
                </StyledLink>
              ))}
            </Nav>
            {!isLogin ? (
              <StyledButton
                onClick={() => router.push(`${window.location.pathname}?login=true`, window.location.pathname)}>
                로그인
              </StyledButton>
            ) : (
              <StyledButton onClick={onLogout}>로그아웃</StyledButton>
            )}
          </Wrapper>
        </div>
      </HeaderBox>
      {!isLogin && query && query.login && <LoginForm />}
    </>
  );
};

const HeaderBox = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #000;
  color: #fff;
  height: var(--hh);
  z-index: 10;
  h1 {
    font-weight: normal;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  & > div {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    & > a {
      height: var(--hh);
      display: flex;
      align-items: center;
    }
  }

  #basic-button {
    cursor: pointer;
  }

  .menuBtn {
    display: none;
    svg {
      font-size: 2rem;
    }
  }
  @media screen and (max-width: 620px) {
    & > div {
      display: block;
      padding: 0;
    }
    .menuBtn {
      display: block;
    }
    .row {
      padding: 0 1rem;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  &.mobile {
    display: none;
  }
  @media screen and (max-width: 620px) {
    display: none;
    &.mobile {
      display: none;
      background-color: #000;
      padding-bottom: 1rem;
      &.open {
        display: block;
      }
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
  align-items: center;
  z-index: 10;
  @media screen and (max-width: 620px) {
    flex-direction: column;
    margin-bottom: 1.4rem;
  }
`;

const StyledLink = styled(Link)<{ to: string; path: string }>`
  font-weight: ${({ to, path }) => (to === path ? 'bold' : 'normal')};
  @media screen and (max-width: 620px) {
    width: 100%;
    text-align: center;
  }
`;

const StyledButton = styled(Button)`
  color: white;
  border-color: white;
  &:hover {
    border-color: white;
  }
  @media screen and (max-width: 620px) {
    width: 100%;
    text-align: center;
  }
`;

export default Header;
