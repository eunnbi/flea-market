import CustomHead from "@components/common/CustomHead";
import WishList from "@components/WishList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { productAPI } from "api/product";
import { verifyUser } from "@lib/verifyUser";

const MyWishList = ({
  wishList,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <main className="flex flex-col items-center max-w-screen-xl">
        <h1 className="font-bold text-2xl text-center mb-6">
          {userId}님의 위시리스트
        </h1>
        <WishList wishList={wishList} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin, user, token } = await verifyUser(req, {
    role: "BUYER",
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  const { data: wishList } = await productAPI.getWishList(absoluteUrl);
  return { props: { isLogin, wishList, userId: user!.userId } };
};

export default MyWishList;
