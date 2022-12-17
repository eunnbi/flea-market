import styled from "@emotion/styled";
import { getDiffDay } from "@lib/getDiffDay";
import { getImageUrl } from "@lib/getImageUrl";
import { Chip } from "@mui/material";
import { IoMdHeart } from "react-icons/io";
import ProductList, { ImageWrapper, StyledLink } from "./common/ProductList";
import Image from "next/image";
import { BsFillPeopleFill } from "react-icons/bs";

const WishList = ({ products }: { products: ProductItem[] }) => {
  return (
    <ProductList
      products={products}
      Item={Item}
      emptyText="좋아하는 상품이 없습니다. 상품을 추가해보세요."
    />
  );
};

const Item = ({ product }: { product: ProductItem }) => {
  const { id, name, price, status, image, likeCnt, endingAt, bid } = product;
  const endingDate = new Date(String(endingAt));
  return (
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
          label={
            status === "AUCTION"
              ? "경매"
              : status === "PROGRESS"
              ? "판매 진행중"
              : "판매 완료"
          }
          className="status"
        />
        {status === "AUCTION" && (
          <Chip
            label={`D-${getDiffDay(endingDate)}`}
            className="dday"
            variant="outlined"
          />
        )}
      </div>

      <div className="wrapper">
        <h3>{name}</h3>
        <div className="row">
          {status != "AUCTION" ? (
            <p className="price">{price.toLocaleString()}원</p>
          ) : (
            <p className="price">
              {bid.length === 0
                ? "입찰 없음"
                : `${Math.max(
                    ...bid.map((elem) => elem.price)
                  ).toLocaleString()}원`}
            </p>
          )}
          <div className="row">
            {status === "AUCTION" && (
              <p className="cnt">
                <BsFillPeopleFill />
                <span>{bid.length}</span>
              </p>
            )}
            <p className="cnt">
              <IoMdHeart className="heart_icon" />
              <span>{likeCnt}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WishList;
