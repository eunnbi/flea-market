import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import WishList from "@components/WishList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { userAPI } from "api/user";
import { productAPI } from "api/product";

const MyWishList = ({
  wishList,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <main className="flex flex-col">
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
    const { data: wishList } = await productAPI.getWishList({
      absoluteUrl,
      token,
    });
    return { props: { isLogin: verify, wishList, userId: user.userId } };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default MyWishList;
