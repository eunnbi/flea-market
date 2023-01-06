import CustomHead from "@components/common/CustomHead";
import { getImageUrl } from "@lib/getImageUrl";
import { useEffect } from "react";
import styles from "@styles/ProductDetail.module.css";
import { IoCallOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { RiHistoryLine } from "react-icons/ri";
import { Chip } from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import Header from "@components/common/Header";
import { Bidding } from "@prisma/client";
import AuctionHistory from "@components/product/AuctionHistory";
import { getDiffDay } from "@lib/getDiffDay";
import { useSetRecoilState } from "recoil";
import { locationState } from "@store/locationState";
import BuyingButton from "@components/product/BuyingButton";
import BiddingButton from "@components/product/BiddingButton";
import LikeButton from "@components/product/LikeButton";
import TradingPlaceMap from "@components/product/TradingPlaceMap";
import { userAPI } from "api/user";

const ProductDetail = ({
  token,
  product,
  isLogin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    id,
    name,
    price,
    tradingPlace,
    endingAt,
    status,
    image,
    content,
    likeCnt,
    phoneNumber,
    user,
    wish,
    bid,
    sellerId,
  } = product;
  const endingDate = new Date(String(endingAt));
  const setLocationState = useSetRecoilState(locationState);
  useEffect(() => {
    setLocationState(tradingPlace);
  }, [tradingPlace]);
  return (
    <>
      <CustomHead title={product.name} />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status !== "AUCTION" ? (
            <p className={styles.price}>{price.toLocaleString()}원</p>
          ) : (
            <p className={styles.price}>
              {bid.length === 0
                ? "입찰 없음"
                : `${bid[0].price.toLocaleString()}원`}
            </p>
          )}
        </section>
        <section className={styles.contentBox}>
          <div className={styles.row}>
            <Chip
              label={
                status === "AUCTION"
                  ? "경매"
                  : status === "PROGRESS"
                  ? "판매 진행중"
                  : "판매 완료"
              }
            />
            {status === "AUCTION" && (
              <Chip label={`D-${getDiffDay(endingDate)}`} />
            )}
          </div>
          {status === "AUCTION" && (
            <p className={styles.content}>
              <BsCalendarDate />
              <span>
                {endingDate.getFullYear()}-{endingDate.getMonth() + 1}-
                {endingDate.getDate()}
              </span>
            </p>
          )}
          <div className={styles.content}>
            <BiUser />
            <div className={styles.name}>
              {user.firstName} {user.lastName}
            </div>
            <Chip label={`⭐ ${user.rating}`} size="small" variant="outlined" />
          </div>
          <p className={styles.content}>
            <IoCallOutline />
            {phoneNumber}
          </p>
          <p className={styles.content}>
            <FaRegComment />
            {content}
          </p>
          <TradingPlaceMap tradingPlace={tradingPlace} />
          {status === "AUCTION" && (
            <div className={styles.contentStart}>
              <RiHistoryLine />
              <div className={styles.bidTable}>
                <span>입찰목록 ({bid.length})</span>
                <AuctionHistory history={bid} />
              </div>
            </div>
          )}
        </section>
        <div className={styles.likeCnt}>
          <LikeButton token={token} id={id} wish={wish} />
          <span>{likeCnt}</span>
        </div>
        {status !== "PURCHASED" &&
          (status === "PROGRESS" ? (
            <BuyingButton
              price={price}
              id={id}
              sellerId={sellerId}
              token={token}
            />
          ) : (
            <BiddingButton
              token={token}
              id={id}
              maxPrice={
                bid.length === 0
                  ? 0
                  : Math.max(...bid.map((elem: Bidding) => elem.price))
              }
            />
          ))}
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const absoluteUrl = getAbsoluteUrl(req);
  const { data } = await userAPI.verify({
    absoluteUrl,
    token: cookies.access_token,
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
    const res = await fetch(
      `${absoluteUrl}/api/product?id=${query.id as string}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      }
    );
    const product = await res.json();
    return {
      props: {
        product,
        token: cookies.access_token === undefined ? null : cookies.access_token,
        isLogin: verify,
      },
    };
  }
  const res = await fetch(
    `${absoluteUrl}/api/product?id=${query.id as string}`
  );
  const product = await res.json();
  return {
    props: {
      product,
      token: cookies.access_token === undefined ? null : cookies.access_token,
      isLogin: verify,
    },
  };
};

export default ProductDetail;
