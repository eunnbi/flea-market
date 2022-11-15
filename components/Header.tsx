import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/products',
    name: 'Products',
  },
];

const Header = () => {
  const { pathname } = useRouter();
  return (
    <HeaderBox>
      <div>
        <Link href="/">
          <h1>Flea Market</h1>
        </Link>
        <Nav>
          {NAV.map((elem, index) => (
            <StyledLink to={elem.to} path={pathname} key={index} href={elem.to}>
              {elem.name}
            </StyledLink>
          ))}
        </Nav>
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
  }
  h1 {
    font-weight: normal;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
`;

const StyledLink = styled(Link)<{ to: string; path: string }>`
  font-weight: ${({ to, path }) => (to === path ? 'bold' : 'normal')};
`;

export default Header;
