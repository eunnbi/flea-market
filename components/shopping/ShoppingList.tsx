import styled from "@emotion/styled";
import { getImageUrl } from "@lib/getImageUrl";
import { User } from "@prisma/client";
import { BiUser } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { Button, Rating } from "@mui/material";
import EmptyText from "@components/common/EmptyText";
import useModal from "hooks/useModal";
import RatingDialog from "./RatingDialog";

const ShoppingList = ({
  list,
  dates,
}: {
  list: ShoppingItem[];
  dates: string[];
}) => {
  const { openModal, closeModal } = useModal();
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.itemid;
    const rating = e.currentTarget.dataset.rating;
    if (id === undefined || rating === undefined) return;
    openModal(RatingDialog, {
      id,
      initialRating: Number(rating),
      handleClose: closeModal,
    });
  };

  const newDates = [
    ...new Set(
      dates
        .map((date) => new Date(date))
        .map(
          (date) =>
            `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
        )
    ),
  ];

  return dates.length === 0 ? (
    <EmptyText>구매 목록이 없습니다.</EmptyText>
  ) : (
    <section className="flex flex-col gap-4 w-full">
      {newDates.map((date, index) => (
        <article key={index}>
          <h3 className="font-bold mb-4">{date}</h3>
          <div>
            {list
              .filter(({ item }) => {
                const buyingDate = new Date(item.createdAt);
                return (
                  `${buyingDate.getFullYear()}.${
                    buyingDate.getMonth() + 1
                  }.${buyingDate.getDate()}` === date
                );
              })
              .map(({ item, product }) => (
                <Item key={product.id}>
                  <Product product={product} />
                  {item.rating === 0 ? (
                    <Button
                      variant="outlined"
                      data-itemid={item.id}
                      data-rating={item.rating}
                      onClick={handleOpen}
                    >
                      {item.rating === 0 ? "판매자 평가하기" : "평가 수정하기"}
                    </Button>
                  ) : (
                    <RatingBox>
                      <Rating
                        defaultValue={item.rating}
                        precision={0.5}
                        value={item.rating}
                        readOnly
                      />
                      <Button
                        variant="outlined"
                        data-itemid={item.id}
                        data-rating={item.rating}
                        onClick={handleOpen}
                      >
                        {item.rating === 0
                          ? "판매자 평가하기"
                          : "평가 수정하기"}
                      </Button>
                    </RatingBox>
                  )}
                </Item>
              ))}
          </div>
        </article>
      ))}
    </section>
  );
};

const Product = ({
  product,
}: {
  product: ProductItem & {
    user: User;
  };
}) => {
  const { id, name, price, image, user, tradingPlace } = product;
  return (
    <Link href={`/products/${id}`} passHref>
      <Image
        className="w-32 h-32"
        src={getImageUrl(image)}
        width={130}
        height={130}
        alt="product thumbnail"
        placeholder="blur"
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      />
      <div>
        <h4>{name}</h4>
        <p className="price">{price.toLocaleString()}원</p>
        <p className="row">
          <BiUser />
          <span>
            {user.firstName} {user.lastName}
          </span>
        </p>
        <p className="row">
          <IoLocationOutline />
          {tradingPlace}
        </p>
      </div>
    </Link>
  );
};

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid lightgray;
  padding-bottom: 1rem;
  a {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  img {
    object-fit: cover;
    border-radius: 5px;
  }
  h4 {
    font-weight: 500;
    margin: 0;
    margin-bottom: 8px;
    text-transform: capitalize;
  }
  .price {
    font-weight: bold;
    margin-bottom: 10px;
  }
  p.row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 0.5rem;
    color: gray;
    font-size: 0.9rem;
    text-transform: capitalize;
  }
  @media screen and (max-width: 420px) {
    flex-direction: column;
    gap: 2rem;
    a {
      width: 100%;
    }
  }
`;

const RatingBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default ShoppingList;
