import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import ShoppingList from "@components/shopping/ShoppingList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { userAPI } from "api/user";
import { productAPI } from "api/product";

const MyShopping = ({
  shoppingList,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <main className="flex flex-col">
        <h1 className="text-center mb-6 font-bold text-2xl">
          {userId}님의 구매 목록
        </h1>
        <ShoppingList shoppingList={shoppingList} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const absoluteUrl = getAbsoluteUrl(req);
  const token = cookies.access_token;
  const { data } = await userAPI.verify({
    absoluteUrl,
    token,
  });
  const { verify, user } = data;
  if (verify && user) {
    if (user.role === "SELLER") {
      return {
        redirect: {
          destination: "/sell",
          permanent: false,
        },
      };
    }
    if (user.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
    const { data: shoppingList } = await productAPI.getShoppingList({
      absoluteUrl,
      token,
    });
    console.log(shoppingList);
    return {
      props: { isLogin: verify, shoppingList, userId: user.userId },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default MyShopping;
