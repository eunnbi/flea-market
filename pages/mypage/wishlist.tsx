import CustomHead from '@components/common/CustomHead';
import Header from '@components/common/Header';
import WishList from '@components/WishList';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const MyPage = ({ wish, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <Main>
        <h2>{user.userId}님의 위시리스트</h2>
        <WishList products={wish} />
      </Main>
    </>
  );
};

const Main = styled.main`
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
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
    const res = await fetch(`${baseUrl}/api/product/wish`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const wish = await res.json();
    return { props: { isLogin: verify, wish, user } };
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default MyPage;
