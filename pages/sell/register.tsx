import CustomHead from '@components/common/CustomHead';
import ProductRegisterForm from '@components/ProductRegisterForm';
import styled from '@emotion/styled';

const ProductRegister = () => {
  return (
    <>
      <CustomHead title="Register Product" />
      <Main>
        <h2>Product Registration</h2>
        <ProductRegisterForm />
      </Main>
    </>
  );
};

const Main = styled.main`
  padding: 2rem 4rem;
`;

export default ProductRegister;
