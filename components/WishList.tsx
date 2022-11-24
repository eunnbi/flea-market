import styled from '@emotion/styled';
import { getDiffDay } from '@lib/getDiffDay';
import { getImageUrl } from '@lib/getImageUrl';
import { Chip } from '@mui/material';
import Link from 'next/link';
import { IoMdHeart } from 'react-icons/io';
import ProductList, { ImageWrapper, ProductItem, StyledLink } from './common/ProductList';
import Image from 'next/image';

const WishList = ({ products }: { products: ProductItem[] }) => {
  return <ProductList products={products} Item={Item} />;
};

const Item = ({ product }: { product: ProductItem }) => {
  const { id, name, price, status, image, likeCnt, endingAt } = product;
  return (
    <StyledLink href={`/products/${id}`} passHref>
      <article>
        <div className="imageBox">
          <ImageWrapper>
            <Image
              src={getImageUrl(image)}
              alt="product thumbnail"
              layout="fill"
              placeholder="blur"
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
            />
          </ImageWrapper>
          <Chip label={status === 'AUCTION' ? '경매' : status === 'PROGRESS' ? '판매 진행중' : '판매 완료'} />
        </div>
        <div>
          <h3>{name}</h3>
          <div className="row">
            {status != 'AUCTION' ? (
              <p className="price">{price.toLocaleString()}원</p>
            ) : (
              <p>D-{getDiffDay(String(endingAt))}</p>
            )}
            <div className="likeCnt">
              <IoMdHeart className="heart_icon" />
              <span>{likeCnt}</span>
            </div>
          </div>
        </div>
      </article>
    </StyledLink>
  );
};

export default WishList;
