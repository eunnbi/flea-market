import CustomHead from "@components/common/CustomHead";
import ShoppingList from "@components/shopping/ShoppingList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { productAPI } from "@api/product";
import { verifyUser } from "@lib/verifyUser";

const MyShopping = ({
  shoppingList,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Shopping List" />
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin, token, user } = await verifyUser(req, {
    role: "BUYER",
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  const { data: shoppingList } = await productAPI.getShoppingList(absoluteUrl);
  return {
    props: { isLogin, shoppingList, userId: user!.userId },
  };
};

export default MyShopping;
