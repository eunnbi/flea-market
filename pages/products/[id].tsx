import CustomHead from '@components/common/CustomHead';
import { getImageUrl } from '@lib/getImageUrl';
import { useEffect, useState } from 'react';
import styles from '@styles/ProductDetail.module.css';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { FaRegComment } from 'react-icons/fa';
import { IoMdHeartEmpty } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { Button, Chip } from '@mui/material';
import { User } from '@prisma/client';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import cookies from 'next-cookies';

const ProductDetail = ({ verify, product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState(false);
  const { id, name, price, tradingPlace, endingAt, status, image, content, likeCnt, phoneNumber, user } = product;
  return (
    <>
      <CustomHead title="Product Name" />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status != 'AUCTION' && <p>{price.toLocaleString()}원</p>}
        </section>
        <section>
          <Chip label={status === 'AUCTION' ? '경매' : status === 'PROGRESS' ? '판매 진행중' : '판매 완료'} />
          {endingAt && (
            <p>
              <BsCalendarDate />
              <span>{String(endingAt).split('T')[0]}</span>
            </p>
          )}
          <p>
            <BiUser />
            {user.name}
          </p>
          <p>
            <IoLocationOutline />
            {tradingPlace}
          </p>
          <p>
            <IoCallOutline />
            {phoneNumber}
          </p>
          <p>
            <FaRegComment />
            {content}
          </p>
        </section>
        <p className="likeCnt">
          <button>
            <IoMdHeartEmpty className="heart_icon" />
          </button>
          {likeCnt}
        </p>
        {status !== 'PURCHASED' && (
          <Button variant="outlined">{status === 'PROGRESS' ? '구매하기' : '경매 참여하기'}</Button>
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req } = ctx;
  const { access_token } = cookies(ctx);
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/product?id=${query.id as string}`);
  const product = await response.json();
  return {
    props: {
      product,
      verify: access_token === undefined ? null : access_token,
    },
  };
};

export default ProductDetail;
