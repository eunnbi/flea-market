import CustomHead from "@components/common/CustomHead";
import { getImageUrl } from "@lib/getImageUrl";
import { useEffect, useState } from "react";
import styles from "@styles/ProductDetail.module.css";
import { IoCallOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import { RiHistoryLine } from "react-icons/ri";
import { TbChevronDown, TbChevronUp } from "react-icons/tb";
import { Button, Chip, Tooltip } from "@mui/material";
import Router from "next/router";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import axios from "axios";
import Header from "@components/common/Header";
import { Bidding, Wish } from "@prisma/client";
import BiddingDialog from "@components/product/BiddingDialog";
import AuctionHistory from "@components/product/AuctionHistory";
import { getDiffDay } from "@lib/getDiffDay";
import Map from "@components/common/Map";
import { useSetRecoilState } from "recoil";
import { locationState } from "@store/locationState";
import { biddingState } from "@store/product/biddingState";
import { buyingState } from "@store/product/buyingState";
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
    image,
    content,
    likeCnt,
    phoneNumber,
    user,
    wish,
    bid,
    sellerId,
  } = product;
  const setBiddingState = useSetRecoilState(biddingState);
  const setBuyingState = useSetRecoilState(buyingState);
  const [openMap, setOpenMap] = useState(false);
  const onClickBuyButton = () => {
    if (token) {
      setBuyingState({
        open: true,
        token,
        id,
        sellerId,
        price,
      });
    } else {
      alert("???? ???????????? ???????????????.");
    }
  };
  const onClickBidButton = () => {
    if (token) {
      setBiddingState({
        open: true,
        token,
        id,
        maxPrice:
          bid.length === 0
            ? 0
            : Math.max(...bid.map((elem: Bidding) => elem.price)),
      });
    } else {
      alert("???? ???????????? ???????????????.");
    }
  };
  const onClickLikeButton = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (token) {
      if (wish === null) {
        try {
          const { data } = await axios.post(`/api/product/wish/${id}`);
          const { success } = data;
          if (success) {
            Router.replace(
              `/products/${id}?alert=?????? ?????????????????? ?????????????????????.`,
              `/products/${id}`
            );
          } else {
            alert("?????? ??????????????? ????????? ??????????????????. ?????? ??????????????????.");
          }
        } catch (e) {
          alert("?????? ??????????????? ????????? ??????????????????. ?????? ??????????????????.");
        }
      } else {
        try {
          const { data } = await axios.delete(`/api/product/wish/${id}`);
          const { success } = data;
          if (success) {
            Router.replace(
              `/products/${id}?alert=???? ????????????????????? ?????????????????????.`,
              `/products/${id}`
            );
          } else {
            alert("?????? ??????????????? ????????? ??????????????????. ?????? ??????????????????.");
          }
        } catch (e) {
          alert("?????? ??????????????? ????????? ??????????????????. ?????? ??????????????????.");
        }
      }
    } else {
      alert("???? ???????????? ???????????????.");
    }
  };

  const endingDate = new Date(String(endingAt));
  const setLocaiontState = useSetRecoilState(locationState);
  useEffect(() => {
    setLocaiontState(tradingPlace);
  }, [product]);
  return (
    <>
      <CustomHead title={product.name} />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status !== "AUCTION" ? (
            <p className={styles.price}>{price.toLocaleString()}???</p>
          ) : (
            <p className={styles.price}>
              {bid.length === 0
                ? "?????? ??????"
                : `${bid[0].price.toLocaleString()}???`}
            </p>
          )}
        </section>
        <section className={styles.contentBox}>
          <div className={styles.row}>
            <Chip
              label={
                status === "AUCTION"
                  ? "??????"
                  : status === "PROGRESS"
                  ? "?????? ?????????"
                  : "?????? ??????"
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
            <Chip label={`??? ${user.rating}`} size="small" variant="outlined" />
          </div>
          <p className={styles.content}>
            <IoCallOutline />
            {phoneNumber}
          </p>
          <div className={styles.contentStart}>
            <FiMapPin />
            <div className={styles.grow}>
              <span className={styles.row}>
                {tradingPlace}
                <Tooltip title={openMap ? "?????? ?????????" : "?????? ??????"} arrow>
                  <button onClick={() => setOpenMap((state) => !state)}>
                    {openMap ? <TbChevronUp /> : <TbChevronDown />}
                  </button>
                </Tooltip>
              </span>
              {openMap && <Map />}
            </div>
          </div>
          <p className={styles.content}>
            <FaRegComment />
            {content}
          </p>
          {status === "AUCTION" && (
            <div className={styles.contentStart}>
              <RiHistoryLine />
              <div className={styles.bidTable}>
                <span>???????????? ({bid.length})</span>
                <AuctionHistory history={bid} />
              </div>
            </div>
          )}
        </section>
        <p className={styles.likeCnt}>
          <Tooltip title="???????????????" arrow>
            <button onClick={onClickLikeButton}>
              {wish ? (
                <IoMdHeart className="heart_icon" />
              ) : (
                <IoMdHeartEmpty className="heart_icon" />
              )}
            </button>
          </Tooltip>
          <span>{likeCnt}</span>
        </p>
        {status !== "PURCHASED" &&
          (status === "PROGRESS" ? (
            <Button variant="outlined" onClick={onClickBuyButton}>
              ????????????
            </Button>
          ) : (
            <Button variant="outlined" onClick={onClickBidButton}>
              ????????????
            </Button>
          ))}
      </main>
      <BuyingDialog />
      <BiddingDialog />
    </>
  );
};

export const getServerSideProps = async ({
  req,
  query,
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
    const res = await fetch(`${baseUrl}/api/product?id=${query.id as string}`, {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    const product = await res.json();
    return {
      props: {
        product,
        token: cookies.access_token === undefined ? null : cookies.access_token,
        isLogin: verify,
      },
    };
  }
  const res = await fetch(`${baseUrl}/api/product?id=${query.id as string}`);
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
