import CustomHead from '@components/common/CustomHead';
import ProductList from '@components/ProductList';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { useState, useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Sell = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(`/api/product?sellerId=${id}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [id]);
  return (
    <>
      <CustomHead title="Home" />
      <main>
        <ProductList products={products} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const { cookies } = req;
  return {
    props: { id: cookies.id },
  };
};

export default Sell;
