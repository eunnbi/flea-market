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
import AuctionHistory from "@components/product/AuctionHistory";
import { getDiffDay } from "@lib/getDiffDay";
import { useSetRecoilState } from "recoil";
import { locationState } from "@store/mapState";
import LikeButton from "@components/product/LikeButton";
import TradingPlaceMap from "@components/product/TradingPlaceMap";
import { productAPI } from "@api/product";
import BiddingDialog from "@components/product/BiddingDialog";
import useModal from "@hooks/useModal";
import BuyingDialog from "@components/product/BuyingDialog";
import { verifyUser } from "@lib/verifyUser";

const ProductDetail = ({
  token,
  product,
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
  const setLocation = useSetRecoilState(locationState);
  const { openModal, closeModal } = useModal();

  const onClickBiddingButton = () => {
    if (token) {
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
      openModal(BuyingDialog, {
        productId: id,
        handleClose: closeModal,
      });
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };

  useEffect(() => {
    setLocation(tradingPlace);
  }, [tradingPlace]);
  return (
    <>
      <CustomHead title="Product" />
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
          <LikeButton id={id} isLike={isLike} />
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin, token } = await verifyUser(req, {
    role: "BUYER",
    login: false,
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  const { data: product } = await productAPI.getProductDetails(
    absoluteUrl,
    query.id as string
  );
  return {
    props: {
      product,
      token: token || null,
      isLogin,
    },
  };
};

export default ProductDetail;
