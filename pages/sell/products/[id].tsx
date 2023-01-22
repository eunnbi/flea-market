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
import { getDiffDay } from "@lib/getDiffDay";
import AuctionHistory from "@components/product/AuctionHistory";
import { RiHistoryLine } from "react-icons/ri";
import useModal from "@hooks/useModal";
import ProductDeleteDialog from "@components/product/ProductDeleteDialog";
import { productAPI } from "api/product";
import { verifyUser } from "@lib/verifyUser";
import { getStatusLabel } from "@lib/getStatusLabel";
import { getFinalPrice } from "@lib/getFinalPrice";

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
      <CustomHead title="Product" />
      <main className={styles.main}>
        <section>
          <img src={imageUrl} alt={name} />
          <h2>{name}</h2>
          <p className={styles.price}>
            {getFinalPrice({ status, price, bidding })}
          </p>
        </section>
        <section className={styles.contentBox}>
          <div className={styles.row}>
            <Chip label={getStatusLabel(status)} />
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
        {status !== "PURCHASED" && status !== "AUCTION_OFF" && (
          <div className={styles.buttonWrapper}>
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin, token } = await verifyUser(req, {
    role: "SELLER",
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
      isLogin,
    },
  };
};

export default ProductDetail;
