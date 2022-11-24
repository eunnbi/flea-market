import styled from '@emotion/styled';
import { getImageUrl } from '@lib/getImageUrl';
import { Shopping, User } from '@prisma/client';
import { BiUser } from 'react-icons/bi';
import { IoLocationOutline } from 'react-icons/io5';
import { ProductItem } from './common/ProductList';
import Image from 'next/image';
import Link from 'next/link';

export interface ShoppingItem {
  item: Shopping;
  product: ProductItem & {
    user: User;
  };
}

const ShoppingList = ({ list, dates }: { list: ShoppingItem[]; dates: string[] }) => {
  return (
    <Section>
      {dates.map(date => (
        <article key={date}>
          <h3>{date.split('-').join('.')}</h3>
          <div>
            {list
              .filter(({ item }) => String(item.createdAt).split('T')[0] === date)
              .map(({ item, product }) => (
                <Product key={product.id} product={product} />
              ))}
          </div>
        </article>
      ))}
    </Section>
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
      <Item>
        <Image
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
            {user.name}
          </p>
          <p className="row">
            <IoLocationOutline />
            {tradingPlace}
          </p>
        </div>
      </Item>
    </Link>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  h3 {
    margin-bottom: 10px;
  }
`;
const Item = styled.div`
  display: flex;
  margin-top: 2rem;
  gap: 1rem;
  align-items: center;
  img {
    object-fit: cover;
    border-radius: 5px;
  }
  h4 {
    font-weight: 500;
    margin: 0;
    margin-bottom: 8px;
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
  }
`;

export default ShoppingList;
