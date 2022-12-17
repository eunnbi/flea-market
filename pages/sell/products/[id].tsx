import CustomHead from "@components/common/CustomHead";
import { getImageUrl } from "@lib/getImageUrl";
import Router from "next/router";
import { useState } from "react";
import styles from "@styles/ProductDetail.module.css";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";
import { Button, Chip } from "@mui/material";
import SimpleDialog from "@components/common/SimpleDialog";
import axios from "axios";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { getDiffDay } from "@lib/getDiffDay";
import AuctionHistory from "@components/product/AuctionHistory";
import { RiHistoryLine } from "react-icons/ri";
import ProductDeleteDialog from "@components/product/ProductDeleteDialog";
import { useSetRecoilState } from "recoil";
import { productDeleteState } from "@store/product/deleteState";

const ProductDetail = ({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const setProductDeleteState = useSetRecoilState(productDeleteState);
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
    bid,
    rating,
  } = product;
  const endingDate = new Date(String(endingAt));
  const onClickEditButton = () =>
    Router.push(
      {
        pathname: "/sell/register",
        query: {
          id,
        },
      },
      "/sell/register"
    );
  const onClickDeleteButton = () => {
    setProductDeleteState({ open: true, id });
  };
  return (
    <>
      <CustomHead title="Product Name" />
      <Header isLogin={true} />
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
            {status === "AUCTION" && endingAt && (
              <Chip label={`D-${getDiffDay(endingDate)}`} variant="outlined" />
            )}
            {status === "PURCHASED" && (
              <Chip label={`⭐ ${rating}`} variant="outlined" />
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
          <p className={styles.content}>
            <IoLocationOutline />
            {tradingPlace}
          </p>
          <p className={styles.content}>
            <IoCallOutline />
            {phoneNumber}
          </p>
          <p className={styles.content}>
            <FaRegComment />
            {content}
          </p>
          {endingAt && (
            <div className={styles.contentStart}>
              <RiHistoryLine />
              <div className={styles.bidTable}>
                <span>입찰목록 ({bid.length})</span>
                <AuctionHistory history={bid} />
              </div>
            </div>
          )}
        </section>
        <p className={styles.likeCnt}>
          <IoMdHeartEmpty className="heart_icon" />
          {likeCnt}
        </p>
        {status !== "PURCHASED" && (
          <div>
            <Button variant="outlined" onClick={onClickEditButton}>
              수정
            </Button>
            <Button variant="outlined" onClick={onClickDeleteButton}>
              삭제
            </Button>
          </div>
        )}
      </main>
      <ProductDeleteDialog />
    </>
  );
};

export const getServerSideProps = async ({
  req,
  query,
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
      const response = await fetch(
        `${baseUrl}/api/product?id=${query.id as string}`
      );
      const product = await response.json();
      return {
        props: {
          product,
        },
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

export default ProductDetail;
