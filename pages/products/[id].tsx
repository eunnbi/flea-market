import CustomHead from '@components/common/CustomHead';
import { getImageUrl } from '@lib/getImageUrl';
import { useEffect, useState } from 'react';
import styles from '@styles/ProductDetail.module.css';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { FiMapPin } from 'react-icons/fi';
import { RiHistoryLine } from 'react-icons/ri';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';
import { Badge, Button, Chip, Dialog, Tooltip } from '@mui/material';
import Router from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import SimpleDialog from '@components/common/SimpleDialog';
import axios from 'axios';
import Header from '@components/common/Header';
import { Bidding, Wish } from '@prisma/client';
import BiddingDialog from '@components/BiddingDialog';
import AuctionHistory from '@components/AuctionHistory';
import { getDiffDay } from '@lib/getDiffDay';
import Map from '@components/common/Map';

const ProductDetail = ({ token, product, isLogin }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [openBuy, setOpenBuy] = useState(false);
  const [openBid, setOpenBid] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const handleCloseBuy = () => setOpenBuy(false);
  const handleCloseBid = () => setOpenBid(false);
  const onClickBuyButton = () => {
    if (token) {
      setOpenBuy(true);
    } else {
      alert('🔒 로그인이 필요합니다.');
    }
  };
  const onClickBidButton = () => {
    if (token) {
      setOpenBid(true);
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
            Router.replace(`/products/${id}?alert=❤️ 위시리스트에 추가되었습니다.`, `/products/${id}`);
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
            Router.replace(`/products/${id}?alert=🤍 위시리스트에서 삭제되었습니다.`, `/products/${id}`);
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
        sellerId,
        productId: id,
      });
      const { success } = data;
      if (success) {
        Router.replace(
          `/products/${id}?alert=🎉 구매 완료되었습니다! 마이페이지에서 구매 목록을 확인해보세요!`,
          `/products/${id}`,
        );
      } else {
        alert('⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      alert('⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const onConfirmBidding = async (price: number) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const { data } = await axios.post('/api/product/bid', {
        price,
        productId: id,
      });
      const { success } = data;
      if (success) {
        Router.replace(`/products/${id}?alert=🎉 입찰 완료되었습니다!`, `/products/${id}`);
      } else {
        alert('⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      alert('⚠️ 입찰에 실패했습니다. 다시 시도해주세요.');
    }
  };
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
  return (
    <>
      <CustomHead title={product.name} />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <section>
          <img src={getImageUrl(image)} alt="product" />
          <h2>{name}</h2>
          {status != 'AUCTION' && <p className={styles.price}>{price.toLocaleString()}원</p>}
        </section>
        <section className={styles.contentBox}>
          <div className={styles.row}>
            <Chip label={status === 'AUCTION' ? '경매' : status === 'PROGRESS' ? '판매 진행중' : '판매 완료'} />
            {endingAt && <Chip label={`D-${getDiffDay(String(endingAt))}`} />}
          </div>
          {endingAt && (
            <p className={styles.content}>
              <BsCalendarDate />
              <span>{String(endingAt).split('T')[0]}</span>
            </p>
          )}
          <div className={styles.content}>
            <BiUser />
            <div className={styles.name}>
              {user.firstName} {user.lastName}
            </div>
            <Chip label={`⭐ ${user.rating}`} size="small" variant="outlined" />
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
                <Tooltip title={openMap ? '지도 숨기기' : '지도 보기'} arrow>
                  <button onClick={() => setOpenMap(state => !state)}>
                    {openMap ? <TbChevronUp /> : <TbChevronDown />}
                  </button>
                </Tooltip>
              </span>
              {openMap && <Map location={tradingPlace} />}
            </div>
          </div>
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
              입찰하기
            </Button>
          ))}
      </main>
      <SimpleDialog
        open={openBuy}
        handleClose={handleCloseBuy}
        onConfirm={onConfirmBuying}
        basicTitle="정말 구매하시겠습니까?"
        loadingTitle="처리중..."
        content=""
      />
      {status === 'AUCTION' && (
        <BiddingDialog
          open={openBid}
          handleClose={handleCloseBid}
          onConfirm={onConfirmBidding}
          maxPrice={bid.length === 0 ? 0 : Math.max(bid.map((elem: Bidding) => elem.price))}
        />
      )}
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
