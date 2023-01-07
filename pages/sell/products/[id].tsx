import CustomHead from "@components/common/CustomHead";
import Router from "next/router";
import styles from "@styles/ProductDetail.module.css";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";
import { Button, Chip } from "@mui/material";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { getDiffDay } from "@lib/getDiffDay";
import AuctionHistory from "@components/product/AuctionHistory";
import { RiHistoryLine } from "react-icons/ri";
import useModal from "hooks/useModal";
import ProductDeleteDialog from "@components/product/ProductDeleteDialog";
import { userAPI } from "api/user";
import { productAPI } from "api/product";

const ProductDetail = ({
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
    rating,
  } = product;
  const endingDate = new Date(String(endingAt));
  const { openModal, closeModal } = useModal();
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
    openModal(ProductDeleteDialog, {
      id,
      handleClose: closeModal,
    });
  };
  return (
    <>
      <CustomHead title="Product Name" />
      <Header isLogin={true} />
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
                {endingDate.getFullYear()}-
                {(endingDate.getMonth() + 1).toString().padStart(2, "0")}-
                {endingDate.getDate().toString().padStart(2, "0")}
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
                <span>입찰목록 ({bidding.length})</span>
                <AuctionHistory history={bidding} />
              </div>
            </div>
          )}
        </section>
        <p className={styles.likeCnt}>
          <IoMdHeartEmpty className={styles.heartIcon} />
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
