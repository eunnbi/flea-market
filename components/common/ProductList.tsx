import styled from '@emotion/styled';
import { getDiffDay } from '@lib/getDiffDay';
import { getImageUrl } from '@lib/getImageUrl';
import { getTimeForToday } from '@lib/getTimeForToday';
import { Chip } from '@mui/material';
import { Bidding, Image as ImageType, Product, Wish } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { BsFillPeopleFill } from 'react-icons/bs';
import Image from 'next/image';

export interface ProductItem extends Product {
  image: ImageType;
  wish: Wish;
  bid: Bidding[];
}

interface ItemProps {
  product: ProductItem;
}

const ProductList = ({
  products,
  Item,
  result,
}: {
  products: ProductItem[];
  Item?: (props: ItemProps) => JSX.Element;
  result?: boolean;
}) => {
  return (
    <>
      {result && <p className="result">{products.length}개의 상품</p>}
      {products.length <= 2 ? (
        <FlexSection>
          {products.map(product =>
            Item === undefined ? <DefaultItem product={product} /> : <Item product={product} key={product.id} />,
          )}
        </FlexSection>
      ) : (
        <GridSection>
          {products.map(product =>
            Item === undefined ? <DefaultItem product={product} /> : <Item product={product} key={product.id} />,
          )}
        </GridSection>
      )}
    </>
  );
};

const FlexSection = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const GridSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  @media screen and (max-width: 920px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DefaultItem = ({ product }: ItemProps) => {
  const { pathname } = useRouter();
  const { id, name, price, status, image, createdAt, likeCnt, endingAt, wish, bid } = product;
  return (
    <StyledLink
      href={`${pathname.split('/')[1] === 'products' ? '/' : `/${pathname.split('/')[1]}/`}products/${id}`}
      passHref>
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
          <Chip
            label={status === 'AUCTION' ? '경매' : status === 'PROGRESS' ? '판매 진행중' : '판매 완료'}
            className="status"
          />
          {status === 'AUCTION' && (
            <Chip label={`D-${getDiffDay(String(endingAt))}`} className="dday" variant="outlined" />
          )}
        </div>
        <div className="wrapper">
          <div>
            <h3>{name}</h3>
            {status != 'AUCTION' ? (
              <p className="price">{price.toLocaleString()}원</p>
            ) : (
              <div className="row">
                <p className="price">
                  {bid.length === 0 ? '입찰 없음' : `${Math.max(bid.map(elem => elem.price)).toLocaleString()}원`}
                </p>
                <p className="cnt">
                  <BsFillPeopleFill />
                  <span>{bid.length}</span>
                </p>
              </div>
            )}
          </div>
          <div className="row">
            <p className="date">{getTimeForToday(String(createdAt))}</p>
            <div className="cnt">
              {wish ? <IoMdHeart className="heart_icon" /> : <IoMdHeartEmpty className="heart_icon" />}
              <span>{likeCnt}</span>
            </div>
          </div>
        </div>
      </article>
    </StyledLink>
  );
};

export const StyledLink = styled(Link)`
  border-radius: 5px;
  h3 {
    font-weight: normal;
    margin: 3px 0;
    font-size: 1.3rem;
  }
  .price {
    font-weight: bold;
  }
  .date {
    font-size: 0.9rem;
    color: gray;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .imageBox {
    position: relative;
    .status {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 2;
      background-color: #222222;
      color: white;
      font-size: 0.7rem;
      height: 30px;
    }
    .dday {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
      border-color: gray;
      color: gray;
    }
  }
`;

export const ImageWrapper = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 5px;
  position: relative;
  img {
    border-radius: 5px;
    object-fit: cover;
  }
`;

export default ProductList;
