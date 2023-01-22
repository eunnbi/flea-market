import { getDiffDay } from "@lib/getDiffDay";
import { Chip } from "@mui/material";
import { IoMdHeart } from "react-icons/io";
import ProductList from "./common/ProductList";
import Image from "next/image";
import { BsFillPeopleFill } from "react-icons/bs";
import styles from "@styles/ProductList.module.css";
import { ProductItem } from "types/product";
import { getStatusLabel } from "@lib/getStatusLabel";
import { getFinalPrice } from "@lib/getFinalPrice";

const WishList = ({ wishList }: { wishList: ProductItem[] }) => {
  return (
    <ProductList
      products={wishList}
      Item={Item}
      emptyText="좋아하는 상품이 없습니다. 상품을 추가해보세요."
    />
  );
};

export const Item = ({ product }: { product: ProductItem }) => {
  const { id, name, price, status, imageUrl, likeCnt, endingAt, bidding } =
    product;
  const endingDate = new Date(String(endingAt));
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
            {bidding && (
              <p className={styles.cnt}>
                <BsFillPeopleFill />
                <span>{bidding.cnt}</span>
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
