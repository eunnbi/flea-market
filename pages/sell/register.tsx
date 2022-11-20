import CustomHead from '@components/common/CustomHead';
import ProductRegisterForm from '@components/ProductRegisterForm';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const ProductRegister = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

export const getServerSideProps = async ({ query, req }: GetServerSidePropsContext) => {
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
      props: {},
    };
  }
};

export default ProductRegister;
