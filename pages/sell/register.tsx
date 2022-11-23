import CustomHead from '@components/common/CustomHead';
import ProductRegisterForm from '@components/ProductRegisterForm';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import cookies from 'next-cookies';

const ProductRegister = ({ data, access_token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (access_token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  }
  return (
    <>
      <CustomHead title="Register Product" />
      <Main>
        <h2>Product Registration</h2>
        <ProductRegisterForm initialProduct={data} />
      </Main>
    </>
  );
};

const Main = styled.main`
  padding: 2rem;
  h2 {
    margin-bottom: 1.5rem;
  }
`;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { access_token } = cookies(ctx);
  const { query, req } = ctx;
  if (query.id) {
    const baseUrl = getAbsoluteUrl(req);
    const res = await fetch(`${baseUrl}/api/product?id=${query.id}`);
    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } else {
    return {
      props: {
        data: null,
        access_token,
      },
    };
  }
};

export default ProductRegister;
