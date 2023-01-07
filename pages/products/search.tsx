import CustomHead from "@components/common/CustomHead";
import ProductList from "@components/common/ProductList";
import SearchBar from "@components/search/SearchBar";
import SellerFilter from "@components/search/SellerFilter";
import PriceFilter from "@components/search/PriceFilter";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Header from "@components/common/Header";
import { priceState } from "@store/search/priceState";
import { nameState } from "@store/search/nameState";
import { sellerState } from "@store/search/sellerState";
import { userAPI } from "api/user";
import { ProductItem } from "types/product";
import { productAPI } from "api/product";

const ProductsSearch = ({
  sellers,
  isLogin,
  token,
  initialProducts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { startPrice, lastPrice } = useRecoilValue(priceState);
  const name = useRecoilValue(nameState);
  const seller = useRecoilValue(sellerState);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  useEffect(() => {
    productAPI.getProductsByName(token, name).then(({ data }) => {
      setProducts(data);
    });
  }, [name]);
  return (
    <>
      <CustomHead title="Search Products" />
      <Header isLogin={isLogin} />
      <main className="flex flex-col items-center gap-4">
        <SearchBar />
        <div className="flex items-center gap-4">
          <SellerFilter sellers={sellers} />
          <PriceFilter />
        </div>
        <div className="mt-4">
          <h1 className="text-2xl text-center mb-4 font-bold">검색 결과</h1>
          <ProductList
            result={true}
            products={products
              .filter((product) =>
                seller.id === "" ? true : product.sellerId === seller.id
              )
              .filter((product) =>
                startPrice === 0 && lastPrice === 0
                  ? true
                  : product.price >= startPrice &&
                    (lastPrice === 0 ? true : product.price <= lastPrice)
              )}
          />
        </div>
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
    if (user.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
    if (user.role === "SELLER") {
      return {
        redirect: {
          destination: "/sell",
          permanent: false,
        },
      };
    }
    const { data: initialProducts } = await productAPI.getProducts({
      absoluteUrl,
      token,
    });
    const { data: sellers } = await userAPI.getSellers(absoluteUrl);
    return {
      props: {
        sellers: sellers.sort(({ rating: a }, { rating: b }) => {
          if (Number(a) < Number(b)) {
            return 1;
          } else if (Number(a) > Number(b)) {
            return -1;
          } else return 0;
        }),
        initialProducts,
        isLogin: verify,
        token: token === undefined ? null : token,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default ProductsSearch;
