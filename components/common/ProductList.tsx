import styled from "@emotion/styled";
import { getDiffDay } from "@lib/getDiffDay";
import { getImageUrl } from "@lib/getImageUrl";
import { getTimeForToday } from "@lib/getTimeForToday";
import { Chip } from "@mui/material";
import Link from "next/link";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";
import Image from "next/image";
import styles from "@styles/ProductList.module.css";

const ProductList = ({
  products,
  Item,
  result,
  emptyText,
  seller,
}: {
  products: ProductItem[];
  Item?: (props: { product: ProductItem }) => JSX.Element;
  result?: boolean;
  emptyText?: string;
  seller?: boolean;
}) => {
  return (
    <>
      {result && <p className={styles.result}>{products.length}개의 상품</p>}
      {products.length === 0 ? (
        emptyText ? (
          <p className={styles.emptyText}>{emptyText}</p>
        ) : null
      ) : (
        <>
          {products.length <= 2 ? (
            <FlexSection>
              {products.map((product) => (
                <Link
                  className={styles.link}
                  href={
                    seller
                      ? `/sell/products/${product.id}`
                      : `/products/${product.id}`
                  }
                  passHref
                  key={product.id}
                >
                  {Item === undefined ? (
                    <DefaultItem product={product} />
                  ) : (
                    <Item product={product} key={product.id} />
                  )}
                </Link>
              ))}
            </FlexSection>
          ) : (
            <GridSection>
              {products.map((product) => (
                <Link
                  className={styles.link}
                  href={
                    seller
                      ? `/sell/products/${product.id}`
                      : `/products/${product.id}`
                  }
                  passHref
                  key={product.id}
                >
                  {Item === undefined ? (
                    <DefaultItem product={product} />
                  ) : (
                    <Item product={product} key={product.id} />
                  )}
                </Link>
              ))}
            </GridSection>
          )}
        </>
      )}
    </>
  );
};

const FlexSection = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
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

const DefaultItem = ({ product }: { product: ProductItem }) => {
  const {
    id,
    name,
    price,
    status,
    image,
    createdAt,
    likeCnt,
    endingAt,
    wish,
    bid,
  } = product;
  const endingDate = new Date(String(endingAt));
  return (
    <article>
      <div className={styles.imageBox}>
        <ImageWrapper>
          <Image
            src={getImageUrl(image)}
            alt="product thumbnail"
            fill
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        </ImageWrapper>
        <Chip
          label={
            status === "AUCTION"
              ? "경매"
              : status === "PROGRESS"
              ? "판매 진행중"
              : "판매 완료"
          }
          className={styles.status}
        />
        {status === "AUCTION" && (
          <Chip label={`D-${getDiffDay(endingDate)}`} className={styles.dday} />
        )}
      </div>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{name}</h3>
        {status != "AUCTION" ? (
          <p className={styles.price}>{price.toLocaleString()}원</p>
        ) : (
          <div className={styles.row}>
            <p className={styles.price}>
              {bid.length === 0
                ? "입찰 없음"
                : `${Math.max(
                    ...bid.map((elem) => elem.price)
                  ).toLocaleString()}원`}
            </p>
            <p className={styles.cnt}>
              <BsFillPeopleFill />
              <span>{bid.length}</span>
            </p>
          </div>
        )}
        <div className={styles.row}>
          <p className={styles.date}>{getTimeForToday(String(createdAt))}</p>
          <div className={styles.cnt}>
            {wish ? (
              <IoMdHeart className={styles.heartIcon} />
            ) : (
              <IoMdHeartEmpty className={styles.heartIcon} />
            )}
            <span>{likeCnt}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const ImageWrapper = styled.div`
  width: 80vmin;
  height: 80vmin;
  max-width: 250px;
  max-height: 250px;
  border-radius: 5px;
  position: relative;
  img {
    border-radius: 5px;
    object-fit: cover;
  }
`;

export default ProductList;
