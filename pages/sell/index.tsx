import CustomHead from "@components/common/CustomHead";
import ProductList from "@components/common/ProductList";
import { useState, useEffect } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import StatusFilter from "@components/common/StatusFilter";
import SortFilter from "@components/common/SortFilter";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import Header from "@components/common/Header";
import { useRecoilValue } from "recoil";
import { statusFilterState } from "@store/statusFilterState";
import { sortFilterState } from "@store/sortFilterState";
import styles from "@styles/Main.module.css";

const mainClassName = `${styles.main} max-w-screen-xl`;

const Sell = ({
  token,
  data,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const filter = useRecoilValue(statusFilterState);
  const sort = useRecoilValue(sortFilterState);
  const [products, setProducts] = useState<ProductItem[]>(data);
  useEffect(() => {
    fetch(`/api/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [token]);
  return (
    <>
      <CustomHead title="Home" />
      <Header isLogin={true} />
      <main className={mainClassName}>
        <h1 className="font-bold text-3xl mb-8">{user.userId}님의 상품들</h1>
        <StatusFilter />
        <SortFilter />
        <ProductList
          seller={true}
          emptyText="등록한 상품이 없습니다. 상품을 등록해주세요!"
          products={
            sort === "최신순"
              ? products
                  .filter((product) => {
                    if (product.status === "AUCTION" && filter.AUCTION)
                      return true;
                    if (product.status === "PROGRESS" && filter.PROGRESS)
                      return true;
                    if (product.status === "PURCHASED" && filter.PURCHASED)
                      return true;
                    return false;
                  })
                  .sort(({ createdAt: a }, { createdAt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
              : products
                  .filter((product) => {
                    if (product.status === "AUCTION" && filter.AUCTION)
                      return true;
                    if (product.status === "PROGRESS" && filter.PROGRESS)
                      return true;
                    if (product.status === "PURCHASED" && filter.PURCHASED)
                      return true;
                    return false;
                  })
                  .sort(({ likeCnt: a }, { likeCnt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
          }
        />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token
        ? `Bearer ${cookies.access_token}`
        : "Bearer",
    },
  });
  const { verify, user } = await res.json();
  if (verify) {
    if (user.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
    if (user.role === "SELLER") {
      const response = await fetch(`${baseUrl}/api/product`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      const data = await response.json();
      return {
        props: { token: cookies.access_token, data, user },
      };
    }
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default Sell;
