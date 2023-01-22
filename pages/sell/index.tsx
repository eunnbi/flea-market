import CustomHead from "@components/common/CustomHead";
import ProductList from "@components/common/ProductList";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import StatusFilter from "@components/common/StatusFilter";
import SortFilter from "@components/common/SortFilter";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { useRecoilValue } from "recoil";
import { statusFilterState } from "@store/statusFilterState";
import { sortFilterState } from "@store/sortFilterState";
import styles from "@styles/Main.module.css";
import { productAPI } from "api/product";
import { verifyUser } from "@lib/verifyUser";

const mainClassName = `${styles.main} max-w-screen-xl`;

const Sell = ({
  products,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const filter = useRecoilValue(statusFilterState);
  const sort = useRecoilValue(sortFilterState);
  return (
    <>
      <CustomHead title="Home" />
      <main className={mainClassName}>
        <h1 className="font-bold text-3xl mb-8">{userId}님의 상품들</h1>
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin, token, user } = await verifyUser(req, {
    role: "SELLER",
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  const { data: products } = await productAPI.getSellerProducts(absoluteUrl);
  return {
    props: { products, userId: user!.userId, isLogin },
  };
};

export default Sell;
