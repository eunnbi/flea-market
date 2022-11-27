import CustomHead from '@components/common/CustomHead';
import Header from '@components/common/Header';
import ShoppingList, { ShoppingItem } from '@components/ShoppingList';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect } from 'react';

const MyShopping = ({ shopping, dates, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <Main>
        <h2>{user.userId}님의 구매 목록</h2>
        <ShoppingList list={shopping} dates={dates} />
      </Main>
    </>
  );
};

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--hh));
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  @media screen and (max-width: 620px) {
    min-height: calc(var(--vh, 1vh) * 100 - var(--hh));
  }
`;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer',
    },
  });
  const { verify, user } = await response.json();
  if (verify) {
    if (user.role === 'SELLER') {
      return {
        redirect: {
          destination: '/sell',
          permanent: false,
        },
      };
    }
    if (user.role === 'ADMIN') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
    const res = await fetch(`${baseUrl}/api/product/buy`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const shopping: ShoppingItem[] = await res.json();
    const dates = shopping.map(({ item }) => String(item.createdAt));
    return { props: { isLogin: verify, shopping, dates: [...new Set(dates)], user } };
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default MyShopping;
