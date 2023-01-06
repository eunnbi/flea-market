import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import ShoppingList from "@components/shopping/ShoppingList";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import styles from "@styles/Main.module.css";

const MyShopping = ({
  shopping,
  dates,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <main className={styles.main}>
        <h1 className="text-center mb-6 font-bold text-2xl">
          {user.userId}님의 구매 목록
        </h1>
        <ShoppingList list={shopping} dates={dates} />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token
        ? `Bearer ${cookies.access_token}`
        : "Bearer",
    },
  });
  const { verify, user } = await response.json();
  if (verify) {
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
    const res = await fetch(`${baseUrl}/api/product/buy`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const shopping: ShoppingItem[] = await res.json();
    const dates = shopping.map(({ item }) => String(item.createdAt));
    return {
      props: { isLogin: verify, shopping, dates: [...new Set(dates)], user },
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
