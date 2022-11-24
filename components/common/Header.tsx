import styled from '@emotion/styled';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import LoginForm from '@components/LoginForm';

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
      NAV: [{ to: '/products/search', name: 'Search Product' }],
    };
  }
};

const Header = ({ isLogin }: { isLogin: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const { pathname, query } = router;
  const { basePath, NAV } = getHeaderInfo(pathname, isLogin);
  const onLogout = () => {
    axios.post('/api/auth/logout').then(() => {
      router.push('/');
    });
  };
  return (
    <>
      <HeaderBox>
        <div>
          <Link href={basePath}>
            <h1>{basePath === '/admin' ? 'DashBoard' : 'Flea Market'}</h1>
          </Link>
          <Wrapper>
            <Nav>
              {NAV.map((elem, index) => (
                <StyledLink to={elem.to} path={pathname} key={index} href={elem.to}>
                  {elem.name}
                </StyledLink>
              ))}
              {isLogin && basePath === '/' && (
                <div>
                  <Typography
                    sx={{
                      fontWeight: pathname.split('/')[1] === 'mypage' ? 'bold' : 'normal',
                      fontSize: '1.2rem',
                      lineHeight: 'inherit',
                    }}
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    My Page
                  </Typography>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}>
                    <MenuItem onClick={handleClose}>
                      <Link href="/mypage/shopping">구매 목록</Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link href="/mypage/wishlist">위시리스트</Link>
                    </MenuItem>
                  </Menu>
                </div>
              )}
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
        </div>
      </HeaderBox>
      {!isLogin && query && query.login && <LoginForm />}
    </>
  );
};

const HeaderBox = styled.header`
  background-color: #000;
  color: #fff;
  height: var(--hh);
  & > div {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
  h1 {
    font-weight: normal;
  }
  #basic-button {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
  align-items: center;
`;

const StyledLink = styled(Link)<{ to: string; path: string }>`
  font-weight: ${({ to, path }) => (to === path ? 'bold' : 'normal')};
`;

const StyledButton = styled(Button)`
  color: white;
  border-color: white;
  &:hover {
    border-color: white;
  }
`;

export default Header;
