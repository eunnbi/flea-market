import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import WishList from "@components/WishList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import styles from "@styles/Main.module.css";
import { userAPI } from "api/user";

const MyWishList = ({
  wish,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <main className={styles.main}>
        <h1 className="font-bold text-2xl text-center mb-6">
          {user.userId}님의 위시리스트
        </h1>
        <WishList products={wish} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const absoluteUrl = getAbsoluteUrl(req);
  const { data } = await userAPI.verify({
    absoluteUrl,
    token: cookies.access_token,
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
    const res = await fetch(`${absoluteUrl}/api/product/wish`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const wish = await res.json();
    return { props: { isLogin: verify, wish, user } };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default MyWishList;
