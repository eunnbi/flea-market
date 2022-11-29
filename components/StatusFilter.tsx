import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  filter: {
    AUCTION: boolean;
    PURCHASED: boolean;
    PROGRESS: boolean;
  };
  setFilter: Dispatch<
    SetStateAction<{
      AUCTION: boolean;
      PURCHASED: boolean;
      PROGRESS: boolean;
    }>
  >;
}

const StatusFilter = ({ filter, setFilter }: Props) => {
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
