import React, { useEffect, useState } from 'react';
import CustomHead from '@components/common/CustomHead';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import ProductList from '@components/ProductList';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const Home = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <>
      <CustomHead title="Home" />
      <Main>
        <ProductList products={products} />
      </Main>
    </>
  );
};

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/product`);
  const products = await res.json();
  return {
    props: {
      products,
    },
  };
};

export default Home;
