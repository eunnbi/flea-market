import CustomHead from '@components/common/CustomHead';
import ProductList, { ProductItem } from '@components/ProductList';
import { useState, useEffect } from 'react';
import StatusFilter from '@components/StatusFilter';
import SortFilter from '@components/SortFilter';
import styled from '@emotion/styled';

const Home = () => {
  const [filter, setFilter] = useState({
    AUCTION: true,
    PURCHASED: true,
    PROGRESS: true,
  });
  const [products, setProducts] = useState<ProductItem[] | []>([]);
  const [sort, setSort] = useState('최신순');
  useEffect(() => {
    fetch(`/api/product`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);
  return (
    <>
      <CustomHead title="Home" />
      <Main>
        <h1>Products</h1>
        <StatusFilter filter={filter} setFilter={setFilter} />
        <SortFilter sort={sort} setSort={setSort} />
        <ProductList
          products={
            sort === '최신순'
              ? products
                  .filter(product => {
                    if (product.status === 'AUCTION' && filter.AUCTION) return true;
                    if (product.status === 'PROGRESS' && filter.PROGRESS) return true;
                    if (product.status === 'PURCHASED' && filter.PURCHASED) return true;
                    return false;
                  })
                  .sort(({ createdAt: a }, { createdAt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
              : products
                  .filter(product => {
                    if (product.status === 'AUCTION' && filter.AUCTION) return true;
                    if (product.status === 'PROGRESS' && filter.PROGRESS) return true;
                    if (product.status === 'PURCHASED' && filter.PURCHASED) return true;
                    return false;
                  })
                  .sort(({ likeCnt: a }, { likeCnt: b }) => {
                    if (a < b) {
                      return 1;
                    } else if (a > b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
          }
        />
      </Main>
    </>
  );
};

const Main = styled.main`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    margin-bottom: 2rem;
  }
`;

export default Home;
