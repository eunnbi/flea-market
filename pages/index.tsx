import CustomHead from '@components/common/CustomHead';
import ProductList, { ProductItem } from '@components/common/ProductList';
import { useState, useEffect } from 'react';
import StatusFilter from '@components/StatusFilter';
import SortFilter from '@components/SortFilter';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Header from '@components/common/Header';

const Home = ({ isLogin, token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filter, setFilter] = useState({
    AUCTION: true,
    PURCHASED: true,
    PROGRESS: true,
  });
  const [products, setProducts] = useState<ProductItem[] | []>([]);
  const [sort, setSort] = useState('최신순');
  useEffect(() => {
    if (!isLogin) {
      fetch(`/api/product`)
        .then(res => res.json())
        .then(data => setProducts(data));
    } else {
      fetch(`/api/product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, []);
  return (
    <>
      <CustomHead title="Home" />
      <Header isLogin={isLogin} />
      <Main>
        <h1>Products</h1>
        <StatusFilter filter={filter} setFilter={setFilter} />
        <SortFilter sort={sort} setSort={setSort} />
        <ProductList
          basePath="/"
          products={
            sort === '최신순'
              ? products
                  .filter(product => {
                    if (product.status === 'AUCTION' && filter.AUCTION) return true;
                    if (product.status === 'PROGRESS' && filter.PROGRESS) return true;
                    if (product.status === 'PURCHASED' && filter.PURCHASED) return true;
                    return false;
                  })
                  .sort(({ createdAt: a }, { createdAt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
              : products
                  .filter(product => {
                    if (product.status === 'AUCTION' && filter.AUCTION) return true;
                    if (product.status === 'PROGRESS' && filter.PROGRESS) return true;
                    if (product.status === 'PURCHASED' && filter.PURCHASED) return true;
                    return false;
                  })
                  .sort(({ likeCnt: a }, { likeCnt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
          }
        />
      </Main>
    </>
  );
};

const Main = styled.main`
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    margin-bottom: 2rem;
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
    const response = await fetch(`${baseUrl}/api/product`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const data = await response.json();
    return {
      props: {
        isLogin: verify,
        token: cookies.access_token,
        data,
      },
    };
  }
  const res = await fetch(`${baseUrl}/api/product`);
  const data = await res.json();
  return { props: { isLogin: verify, token: null, data } };
};

export default Home;
