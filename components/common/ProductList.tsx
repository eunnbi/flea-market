import { getDiffDay } from "@lib/getDiffDay";
import { getTimeForToday } from "@lib/getTimeForToday";
import { Chip } from "@mui/material";
import Link from "next/link";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";
import Image from "next/image";
import styles from "@styles/ProductList.module.css";
import EmptyText from "./EmptyText";
import { ProductItem } from "types/product";
import { useEffect, useState } from "react";
import { getStatusLabel } from "@lib/getStatusLabel";
import { getFinalPrice } from "@lib/getFinalPrice";

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
    imageUrl,
    createdAt,
    likeCnt,
    endingAt,
    isLike,
    bidding,
  } = product;
  const endingDate = new Date(String(endingAt));
  const [timeForToday, setTimeForToday] = useState("");
  useEffect(() => {
    setTimeForToday(getTimeForToday(String(createdAt)));
  }, [createdAt]);
  return (
    <article>
      <div className={styles.imageBox}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.img}
            src={imageUrl}
            alt={name}
            fill
            sizes="250px"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        </div>
        <Chip label={getStatusLabel(status)} className={styles.status} />
        {status === "AUCTION" && (
          <Chip label={`D-${getDiffDay(endingDate)}`} className={styles.dday} />
        )}
      </div>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>{name}</h3>
        {!bidding ? (
          <p className={styles.price}>{getFinalPrice({ status, price })}</p>
        ) : (
          <div className={styles.row}>
            <p className={styles.price}>
              {getFinalPrice({ status, price, maxPrice: bidding.maxPrice })}
            </p>
            <p className={styles.cnt}>
              <BsFillPeopleFill />
              <span>{bidding.cnt}</span>
            </p>
          </div>
        )}
        <div className={styles.row}>
          <p className={styles.date}>{timeForToday}</p>
          <div className={styles.cnt}>
            {isLike ? (
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
