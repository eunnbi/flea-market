import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import WishList from "@components/WishList";
import styled from "@emotion/styled";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";

const MyPage = ({
  wish,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="My Page" />
      <Header isLogin={true} />
      <Main>
        <h1 className="font-bold text-3xl text-center my-5">
          {user.userId}님의 위시리스트
        </h1>
        <WishList products={wish} />
      </Main>
    </>
  );
};

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - var(--hh));
  @media screen and (max-width: 620px) {
    min-height: calc(var(--vh, 1vh) * 100 - var(--hh));
  }
`;
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
    const res = await fetch(`${baseUrl}/api/product/wish`, {
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

export default MyPage;
