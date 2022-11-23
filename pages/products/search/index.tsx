import CustomHead from '@components/common/CustomHead';
import ProductList from '@components/ProductList';
import SearchBar from '@components/SearchBar';
import SellerFilter from '@components/SellerFilter';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { ProductItem } from '@components/ProductList';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';

const ProductsSearch = ({ sellers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProducts] = useState<ProductItem[] | []>([]);
  useEffect(() => {
    fetch(`/api/product`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);
  return (
    <>
      <CustomHead title="Search Products" />
      <Main>
        <SearchBar />
        <SellerFilter sellers={sellers} />
        <ProductList products={products} />
      </Main>
    </>
  );
};
const Main = styled.main`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  h1 {
    margin-bottom: 2rem;
  }
`;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user?role=SELLER`);
  const sellers = await response.json();
  return {
    props: {
      sellers,
    },
  };
};

export default ProductsSearch;
