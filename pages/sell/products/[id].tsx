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
import { DeleteDialog } from '@components/common/DeleteDialog';
import axios from 'axios';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const ProductDetail = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState(false);
  const { id, name, price, tradingPlace, endingAt, status, image, content, likeCnt, phoneNumber } = product;
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
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status != 'AUCTION' && <p>{price}원</p>}
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
      </main>
      <DeleteDialog open={open} handleClose={() => setOpen(false)} onDelete={onDelete} />
    </>
  );
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/product?id=${query.id as string}`);
  const product = await response.json();
  return {
    props: {
      product,
    },
  };
};

export default ProductDetail;
