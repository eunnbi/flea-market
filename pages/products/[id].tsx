import CustomHead from '@components/common/CustomHead';
import { getImageUrl } from '@lib/getImageUrl';
import { useEffect, useState } from 'react';
import styles from '@styles/ProductDetail.module.css';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { FaRegComment } from 'react-icons/fa';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { Button, Chip, Tooltip } from '@mui/material';
import Router from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import SimpleDialog from '@components/common/SimpleDialog';
import axios from 'axios';
import Header from '@components/common/Header';
import { Wish } from '@prisma/client';

const ProductDetail = ({ token, product, isLogin }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const onClickBuyButton = () => {
    if (token) {
      setOpen(true);
    } else {
      alert('🔒 로그인이 필요합니다.');
    }
  };
  const onClickBidButton = () => {
    if (token) {
    } else {
      alert('🔒 로그인이 필요합니다.');
    }
  };
  const onClickLikeButton = async (wish: Wish | null) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (token) {
      if (wish === null) {
        try {
          const { data } = await axios.post(`/api/product/wish/${id}`);
          const { success } = data;
          if (success) {
            Router.replace(`/products/${id}?alert=❤️ 위시리스트에 추가되었습니다.`);
          } else {
            alert('⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (e) {
          alert('⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        try {
          const { data } = await axios.delete(`/api/product/wish/${id}`);
          const { success } = data;
          if (success) {
            Router.replace(`/products/${id}?alert=🤍 위시리스트에서 삭제되었습니다.`);
          } else {
            alert('⚠️ 위시리스트 삭제에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (e) {
          alert('⚠️ 위시리스트 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } else {
      alert('🔒 로그인이 필요합니다.');
    }
  };
  const onConfirmBuying = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const { data } = await axios.post('/api/product/buy', {
        price,
        productId: id,
      });
      const { success } = data;
      if (success) {
        Router.replace(`/products/${id}?alert=🎉 구매 완료되었습니다! 마이페이지에서 구매 목록을 확인해보세요!`);
      } else {
        alert('⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      alert('⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const { id, name, price, tradingPlace, endingAt, status, image, content, likeCnt, phoneNumber, user, wish } = product;
  console.log(wish);
  return (
    <>
      <CustomHead title={product.name} />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{product.name}</h2>
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
        <p className={styles.likeCnt}>
          <Tooltip title="위시리스트" arrow>
            <button onClick={() => onClickLikeButton(wish)}>
              {wish ? <IoMdHeart className="heart_icon" /> : <IoMdHeartEmpty className="heart_icon" />}
            </button>
          </Tooltip>
          <span>{likeCnt}</span>
        </p>
        {status !== 'PURCHASED' &&
          (status === 'PROGRESS' ? (
            <Button variant="outlined" onClick={onClickBuyButton}>
              구매하기
            </Button>
          ) : (
            <Button variant="outlined" onClick={onClickBidButton}>
              경매 참여하기
            </Button>
          ))}
      </main>
      <SimpleDialog
        open={open}
        handleClose={handleClose}
        onConfirm={onConfirmBuying}
        basicTitle="정말 구매하시겠습니까?"
        loadingTitle="처리중..."
        content=""
      />
    </>
  );
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer',
    },
  });
  const { verify, user } = await response.json();
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
      return {
        redirect: {
          destination: '/sell',
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
