import CustomHead from "@components/common/CustomHead";
import ProductRegisterForm from "@components/product/ProductRegisterForm";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { verifyUser } from "@lib/verifyUser";
import { productAPI } from "api/product";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const ProductRegister = ({
  product,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Register Product" />
      <main>
        <h1 className="font-bold text-2xl mb-6">Product Registration</h1>
        <ProductRegisterForm initialProduct={product} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, token, isLogin } = await verifyUser(req, {
    role: "SELLER",
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  if (query.id) {
    const { data: product } = await productAPI.getProductById(
      absoluteUrl,
      query.id as string
    );
    return {
      props: {
        product,
        isLogin,
        token: token || null,
      },
    };
  } else {
    return {
      props: {
        product: null,
        isLogin,
        token: token || null,
      },
    };
  }
};

export default ProductRegister;
