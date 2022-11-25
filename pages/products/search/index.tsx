import CustomHead from '@components/common/CustomHead';
import ProductList from '@components/common/ProductList';
import SearchBar from '@components/SearchBar';
import SellerFilter from '@components/SellerFilter';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { ProductItem } from '@components/common/ProductList';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { searchState } from 'store/searchState';
import { useRecoilValue } from 'recoil';
import PriceFilter from '@components/PriceFilter';
import Header from '@components/common/Header';

const ProductsSearch = ({ sellers, isLogin, token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { name, seller, startPrice, lastPrice } = useRecoilValue(searchState);
  const [products, setProducts] = useState<ProductItem[] | []>([]);
  useEffect(() => {
    if (!isLogin) {
      fetch(`/api/product?name=${name}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data);
        });
    } else {
      fetch(`/api/product?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data);
        });
    }
  }, [name]);
  return (
    <>
      <CustomHead title="Search Products" />
      <Header isLogin={isLogin} />
      <Main>
        <SearchBar />
        <div className="row">
          <SellerFilter sellers={sellers} />
          <PriceFilter />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h2>검색 결과</h2>
          <ProductList
            result={true}
            products={products
              .filter(product => (seller.id === '' ? true : product.sellerId === seller.id))
              .filter(product =>
                startPrice === 0 && lastPrice === 0
                  ? true
                  : product.price >= startPrice && (lastPrice === 0 ? true : product.price <= lastPrice),
              )}
          />
        </div>
      </Main>
    </>
  );
};
const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  h1 {
    margin-bottom: 2rem;
  }
  h2 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  .result {
    color: gray;
    text-align: center;
    margin-bottom: 1rem;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    if (user.role === 'ADMIN') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
    if (user.role === 'SELLER') {
      return {
        redirect: {
          destination: '/sell',
          permanent: false,
        },
      };
    }
  }
  const res = await fetch(`${baseUrl}/api/user?role=SELLER`);
  const sellers = await res.json();
  return {
    props: {
      sellers,
      isLogin: verify,
      token: cookies.access_token === undefined ? null : cookies.access_token,
    },
  };
};

export default ProductsSearch;
