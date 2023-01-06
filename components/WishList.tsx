import { getDiffDay } from "@lib/getDiffDay";
import { getImageUrl } from "@lib/getImageUrl";
import { Chip } from "@mui/material";
import { IoMdHeart } from "react-icons/io";
import ProductList from "./common/ProductList";
import Image from "next/image";
import { BsFillPeopleFill } from "react-icons/bs";
import styles from "@styles/ProductList.module.css";

const WishList = ({ products }: { products: ProductItem[] }) => {
  return (
    <ProductList
      products={products}
      Item={Item}
      emptyText="좋아하는 상품이 없습니다. 상품을 추가해보세요."
    />
  );
};

export const Item = ({ product }: { product: ProductItem }) => {
  const { id, name, price, status, image, likeCnt, endingAt, bid } = product;
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
          <Chip
            label={`D-${getDiffDay(endingDate)}`}
            className={styles.dday}
            variant="outlined"
          />
        )}
      </div>

      <div className={styles.wrapper}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.row}>
          {status != "AUCTION" ? (
            <p className={styles.price}>{price.toLocaleString()}원</p>
          ) : (
            <p className={styles.price}>
              {bid.length === 0
                ? "입찰 없음"
                : `${Math.max(
                    ...bid.map((elem) => elem.price)
                  ).toLocaleString()}원`}
            </p>
          )}
          <div className={styles.row}>
            {status === "AUCTION" && (
              <p className={styles.cnt}>
                <BsFillPeopleFill />
                <span>{bid.length}</span>
              </p>
            )}
            <p className={styles.cnt}>
              <IoMdHeart className={styles.heartIcon} />
              <span>{likeCnt}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WishList;
