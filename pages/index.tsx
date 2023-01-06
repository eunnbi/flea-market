import CustomHead from "@components/common/CustomHead";
import ProductList from "@components/common/ProductList";
import StatusFilter from "@components/common/StatusFilter";
import SortFilter from "@components/common/SortFilter";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { useRecoilValue } from "recoil";
import { statusFilterState } from "@store/statusFilterState";
import { sortFilterState } from "@store/sortFilterState";
import { userAPI } from "api/user";

const Home = ({
  isLogin,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const filter = useRecoilValue(statusFilterState);
  const sort = useRecoilValue(sortFilterState);
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
  const { data } = await userAPI.verify({
    absoluteUrl: baseUrl,
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
    const response = await fetch(`${baseUrl}/api/product`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const products = await response.json();
    return {
      props: {
        isLogin: verify,
        token: cookies.access_token,
        products,
      },
    };
  }
  const res = await fetch(`${baseUrl}/api/product`);
  const products = await res.json();
  return { props: { isLogin: verify, token: null, products } };
};

export default Home;
