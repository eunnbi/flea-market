import CustomHead from "@components/common/CustomHead";
import ProductList from "@components/common/ProductList";
import { useState, useEffect } from "react";
import StatusFilter from "@components/common/StatusFilter";
import SortFilter from "@components/common/SortFilter";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { useRecoilValue } from "recoil";
import { statusFilterState } from "@store/statusFilterState";
import { sortFilterState } from "@store/sortFilterState";

const Home = ({
  isLogin,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const filter = useRecoilValue(statusFilterState);
  const sort = useRecoilValue(sortFilterState);
  const [products, setProducts] = useState<ProductItem[] | []>([]);
  useEffect(() => {
    if (!isLogin) {
      fetch(`/api/product`)
        .then((res) => res.json())
        .then((data) => setProducts(data));
    } else {
      fetch(`/api/product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  }, [isLogin, token]);
  return (
    <>
      <CustomHead title="Home" />
      <Header isLogin={isLogin} />
      <main className="flex flex-col items-center max-w-screen-xl">
        <h1 className="font-bold text-3xl mb-8">Products</h1>
        <StatusFilter />
        <SortFilter />
        <ProductList
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
    const response = await fetch(`${baseUrl}/api/product`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const data = await response.json();
    return {
      props: {
        isLogin: verify,
        token: cookies.access_token,
        data,
      },
    };
  }
  const res = await fetch(`${baseUrl}/api/product`);
  const data = await res.json();
  return { props: { isLogin: verify, token: null, data } };
};

export default Home;
