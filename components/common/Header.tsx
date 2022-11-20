import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const getHeaderInfo = (pathname: string) => {
  const page = pathname.split('/')[1];
  if (page === 'admin') {
    return {
      basePath: `/${page}`,
      NAV: [],
    };
  } else if (page === 'sell') {
    return {
      basePath: `/${page}`,
      NAV: [{ to: '/sell/register', name: 'Register Your Products' }],
    };
  } else {
    return {
      basePath: '/',
      NAV: [],
    };
  }
};

const Header = ({ isLogin }: { isLogin: boolean }) => {
  const router = useRouter();
  const { pathname } = router;
  const { basePath, NAV } = getHeaderInfo(pathname);
  const onLogout = () => {
    axios.post('/api/auth/logout').then(response => {
      router.push('/');
    });
  };
  return (
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
          </Nav>
          {!isLogin ? (
            <StyledButton variant="outlined" onClick={() => router.push(`${pathname}?login=true`, pathname)}>
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
  );
};

const HeaderBox = styled.header`
  background-color: #000;
  color: #fff;
  height: var(--hh);
  & > div {
    max-width: 1200px;
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
