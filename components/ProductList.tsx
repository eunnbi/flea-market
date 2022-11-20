import styled from '@emotion/styled';
import { getImageUrl } from '@lib/getImageUrl';
import { getTimeForToday } from '@lib/getTimeForToday';
import { Image, Product } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoMdHeartEmpty } from 'react-icons/io';

export interface ProductItem extends Product {
  image: Image;
}

const ProductList = ({ products }: { products: ProductItem[] }) => {
  return (
    <Section>
      {products.map(product => (
        <Item product={product} key={product.id} />
      ))}
    </Section>
  );
};

const Section = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  //grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const Item = ({ product }: { product: ProductItem }) => {
  const { pathname } = useRouter();
  const { id, name, price, status, image, createdAt, likeCnt } = product;
  return (
    <StyledLink href={`${pathname}/products/${id}`}>
      <article>
        <Image src={getImageUrl(image)} alt="product thumbnail" />
        <div className="wrapper">
          <div>
            <h3>{name}</h3>
            <p className="price">{price.toLocaleString()}원</p>
          </div>
          <div className="row">
            <p className="date">{getTimeForToday(String(createdAt))}</p>
            <div className="likeCnt">
              <IoMdHeartEmpty className="heart_icon" />
              <span>{likeCnt}</span>
            </div>
          </div>
        </div>
      </article>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  padding: 1rem;
  border-radius: 5px;
  h3 {
    font-weight: normal;
    margin: 0;
    margin-bottom: 8px;
    font-size: 1.3rem;
  }
  p {
    margin: 0;
    &.price {
      font-weight: bold;
    }
    &.date {
      font-size: 0.9rem;
      color: gray;
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Image = styled.img`
  max-width: 300px;
  width: 100%;
  height: 250px;
  border-radius: 5px;
  object-fit: cover;
`;

export default ProductList;
