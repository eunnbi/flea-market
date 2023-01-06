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
import EmptyText from "./EmptyText";

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
          <EmptyText>{emptyText}</EmptyText>
        ) : null
      ) : (
        <>
          {products.length <= 2 ? (
            <section className="flex justify-center flex-wrap gap-8">
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
            </section>
          ) : (
            <section className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
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
            </section>
          )}
        </>
      )}
    </>
  );
};

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
        <div className={styles.imageWrapper}>
          <Image
            className={styles.img}
            src={getImageUrl(image)}
            alt="product thumbnail"
            fill
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        </div>
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

export default ProductList;
