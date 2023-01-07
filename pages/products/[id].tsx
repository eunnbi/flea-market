import CustomHead from "@components/common/CustomHead";
import { useEffect } from "react";
import styles from "@styles/ProductDetail.module.css";
import { IoCallOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { RiHistoryLine } from "react-icons/ri";
import { Button, Chip } from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import Header from "@components/common/Header";
import AuctionHistory from "@components/product/AuctionHistory";
import { getDiffDay } from "@lib/getDiffDay";
import { useSetRecoilState } from "recoil";
import { locationState } from "@store/locationState";
import LikeButton from "@components/product/LikeButton";
import TradingPlaceMap from "@components/product/TradingPlaceMap";
import { userAPI } from "api/user";
import { productAPI } from "api/product";
import BiddingDialog from "@components/product/BiddingDialog";
import useModal from "hooks/useModal";
import axios from "axios";
import BuyingDialog from "@components/product/BuyingDialog";

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
    imageUrl,
    content,
    likeCnt,
    phoneNumber,
    bidding,
    seller,
    isLike,
  } = product;
  const endingDate = new Date(String(endingAt));
  const setLocationState = useSetRecoilState(locationState);
  const { openModal, closeModal } = useModal();

  const onClickBiddingButton = () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      openModal(BiddingDialog, {
        productId: id,
        maxPrice: bidding.length === 0 ? 0 : bidding[0].price,
        handleClose: closeModal,
      });
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };

  const onClickBuyingButton = () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      openModal(BuyingDialog, {
        productId: id,
        handleClose: closeModal,
      });
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };

  useEffect(() => {
    setLocationState(tradingPlace);
  }, [tradingPlace]);
  return (
    <>
      <CustomHead title={product.name} />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <section>
          <img src={imageUrl} alt="product" />
          <h2>{name}</h2>
          {status !== "AUCTION" ? (
            <p className={styles.price}>{price.toLocaleString()}원</p>
          ) : (
            <p className={styles.price}>
              {bidding.length === 0
                ? "입찰 없음"
                : `${bidding[0].price.toLocaleString()}원`}
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
            <div className={styles.content}>
              <BsCalendarDate />
              <span>
                {endingDate.getFullYear()}-
                {(endingDate.getMonth() + 1).toString().padStart(2, "0")}-
                {endingDate.getDate().toString().padStart(2, "0")}
              </span>
            </div>
          )}
          <div className={styles.content}>
            <BiUser />
            <div className={styles.name}>{seller.name}</div>
            <Chip
              label={`⭐ ${seller.rating}`}
              size="small"
              variant="outlined"
            />
          </div>
          <div className={styles.content}>
            <IoCallOutline />
            {phoneNumber}
          </div>
          <p className={styles.content}>
            <FaRegComment />
            {content}
          </p>
          <TradingPlaceMap tradingPlace={tradingPlace} />
          {status === "AUCTION" && (
            <div className={styles.contentStart}>
              <RiHistoryLine />
              <div className={styles.bidTable}>
                <span>입찰목록 ({bidding.length})</span>
                <AuctionHistory history={bidding} />
              </div>
            </div>
          )}
        </section>
        <div className={styles.likeCnt}>
          <LikeButton token={token} id={id} isLike={isLike} />
          <span>{likeCnt}</span>
        </div>
        {status !== "PURCHASED" &&
          (status === "PROGRESS" ? (
            <Button variant="outlined" onClick={onClickBuyingButton}>
              구매하기
            </Button>
          ) : (
            <Button variant="outlined" onClick={onClickBiddingButton}>
              구매하기
            </Button>
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
    const { data: product } = await productAPI.getProductDetails(
      {
        absoluteUrl,
        token,
      },
      query.id as string
    );
    return {
      props: {
        product,
        token: token === undefined ? null : token,
        isLogin: verify,
      },
    };
  }
  const { data: product } = await productAPI.getProductDetails(
    {
      absoluteUrl,
      token,
    },
    query.id as string
  );
  return {
    props: {
      product,
      token: token === undefined ? null : token,
      isLogin: verify,
    },
  };
};

export default ProductDetail;
