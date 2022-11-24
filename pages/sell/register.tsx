import CustomHead from '@components/common/CustomHead';
import Header from '@components/common/Header';
import ProductRegisterForm from '@components/ProductRegisterForm';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const ProductRegister = ({ data, token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return (
    <>
      <CustomHead title="Register Product" />
      <Header isLogin={true} />
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

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer',
    },
  });
  const { verify, user } = await res.json();
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
      if (query.id) {
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
            token: cookies.access_token,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default ProductRegister;
