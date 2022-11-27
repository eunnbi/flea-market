import CustomHead from '@components/common/CustomHead';
import { getImageUrl } from '@lib/getImageUrl';
import Router from 'next/router';
import { useState } from 'react';
import styles from '@styles/ProductDetail.module.css';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { FaRegComment } from 'react-icons/fa';
import { IoMdHeartEmpty } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { Button, Chip } from '@mui/material';
import SimpleDialog from '@components/common/SimpleDialog';
import axios from 'axios';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Header from '@components/common/Header';
import { getDiffDay } from '@lib/getDiffDay';
import AuctionHistory from '@components/AuctionHistory';
import { RiHistoryLine } from 'react-icons/ri';

const ProductDetail = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState(false);
  const { id, name, price, tradingPlace, endingAt, status, image, content, likeCnt, phoneNumber, bid, rating } =
    product;
  const onDelete = async () => {
    try {
      await axios.delete(`/api/product/${id}`);
      Router.push(`/sell?alert=✂️ 상품이 정상적으로 삭제되었습니다`, '/sell');
    } catch (e) {
      alert('상품을 삭제할 수 없습니다. 다시 시도해주세요.');
    }
  };
  return (
    <>
      <CustomHead title="Product Name" />
      <Header isLogin={true} />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status != 'AUCTION' && <p className={styles.price}>{price.toLocaleString()}원</p>}
        </section>
        <section className={styles.contentBox}>
          <div className={styles.row}>
            <Chip label={status === 'AUCTION' ? '경매' : status === 'PROGRESS' ? '판매 진행중' : '판매 완료'} />
            {status === 'AUCTION' && endingAt && (
              <Chip label={`D-${getDiffDay(String(endingAt))}`} variant="outlined" />
            )}
            {status === 'PURCHASED' && <Chip label={`⭐ ${rating}`} variant="outlined" />}
          </div>
          {endingAt && (
            <p className={styles.content}>
              <BsCalendarDate />
              <span>{String(endingAt).split('T')[0]}</span>
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
          {status === 'AUCTION' && (
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
        {status !== 'PURCHASED' && (
          <div>
            <Button
              variant="outlined"
              onClick={() =>
                Router.push(
                  {
                    pathname: '/sell/register',
                    query: {
                      id,
                    },
                  },
                  '/sell/register',
                )
              }>
              수정
            </Button>
            <Button variant="outlined" onClick={() => setOpen(true)}>
              삭제
            </Button>
          </div>
        )}
      </main>
      <SimpleDialog
        open={open}
        handleClose={() => setOpen(false)}
        onConfirm={onDelete}
        basicTitle="정말 삭제하시겠습니까?"
        loadingTitle="삭제 중..."
        content=""
      />
    </>
  );
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer',
    },
  });
  const { verify, user } = await res.json();
  if (verify) {
    if (user.role === 'ADMIN') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
    if (user.role === 'SELLER') {
      const response = await fetch(`${baseUrl}/api/product?id=${query.id as string}`);
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
      destination: '/',
      permanent: false,
    },
  };
};

export default ProductDetail;
