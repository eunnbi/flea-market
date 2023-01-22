import { BiUser } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { Button, Rating } from "@mui/material";
import EmptyText from "@components/common/EmptyText";
import useModal from "@hooks/useModal";
import RatingDialog from "./RatingDialog";
import { ShoppingListResponse, ShoppingItem } from "types/product";
import { changeDateFormat } from "@lib/datetimeFormat";

const ShoppingList = ({
  shoppingList,
}: {
  shoppingList: ShoppingListResponse;
}) => {
  const { openModal, closeModal } = useModal();
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id;
    const rating = e.currentTarget.dataset.rating;
    if (id === undefined || rating === undefined) return;
    openModal(RatingDialog, {
      id,
      initialRating: Number(rating),
      handleClose: closeModal,
    });
  };

  return shoppingList.length === 0 ? (
    <EmptyText>구매 목록이 없습니다.</EmptyText>
  ) : (
    <section className="flex flex-col gap-4 w-full">
      {shoppingList.map(({ date, list }) => (
        <article key={String(date)}>
          <h3 className="font-bold mb-4">{changeDateFormat(new Date(date))}</h3>
          <div>
            {list.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center mb-8 pb-4 border-b-2 border-solid border-lightGray max-sm:flex-col max-sm:gap-8"
              >
                <Product product={product} />
                {product.rating === 0 ? (
                  <Button
                    variant="outlined"
                    onClick={handleOpen}
                    data-id={product.id}
                    data-rating={product.rating}
                  >
                    판매자 평가하기
                  </Button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Rating
                      defaultValue={product.rating}
                      precision={0.5}
                      value={product.rating}
                      readOnly
                    />
                    <Button
                      variant="outlined"
                      onClick={handleOpen}
                      data-id={product.id}
                      data-rating={product.rating}
                    >
                      평가 수정하기
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

const Product = ({ product }: { product: ShoppingItem }) => {
  const { id, name, price, imageUrl, tradingPlace, seller } = product;
  return (
    <Link
      href={`/products/${id}`}
      passHref
      className="flex gap-4 items-center max-sm:w-full"
    >
      <Image
        className="w-32 h-32 object-cover rounded"
        src={imageUrl}
        width={130}
        height={130}
        alt={name}
        placeholder="blur"
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      />
      <div>
        <h4 className="mb-2 font-medium capitalize">{name}</h4>
        <p className="font-bold mb-2">{price.toLocaleString()}원</p>
        <p className="flex items-center gap-1 mb-2 text-gray capitalize">
          <BiUser />
          <span>{seller.name}</span>
        </p>
        <p className="flex items-center gap-1 mb-2 text-gray capitalize">
          <IoLocationOutline />
          {tradingPlace}
        </p>
      </div>
    </Link>
  );
};

export default ShoppingList;
