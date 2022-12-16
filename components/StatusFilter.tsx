import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import { productsState } from '@store/productsState';
import { statusFilterState } from '@store/statusFilterState';
import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

const StatusFilter = () => {
  const setProducts = useSetRecoilState(productsState);
  const [filter, setFilter] = useRecoilState(statusFilterState);
  useEffect(() => {
    setProducts(state => ({ ...state, products: state.initialProducts.filter(product => {
      if (product.status === 'AUCTION' && filter.AUCTION) return true;
      if (product.status === 'PROGRESS' && filter.PROGRESS) return true;
      if (product.status === 'PURCHASED' && filter.PURCHASED) return true;
      return false;
    })}));
  }, [filter]);
  return (
    <Div>
      <Chip
        label="경매"
        onClick={() => setFilter(filter => ({ ...filter, AUCTION: !filter.AUCTION }))}
        variant={filter.AUCTION ? 'filled' : 'outlined'}
        className="filterChip"
      />
      <Chip
        label="판매 진행 중"
        onClick={() => setFilter(filter => ({ ...filter, PROGRESS: !filter.PROGRESS }))}
        variant={filter.PROGRESS ? 'filled' : 'outlined'}
        className="filterChip"
      />
      <Chip
        label="판매 완료"
        onClick={() => setFilter(filter => ({ ...filter, PURCHASED: !filter.PURCHASED }))}
        variant={filter.PURCHASED ? 'filled' : 'outlined'}
        className="filterChip"
      />
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default React.memo(StatusFilter);
