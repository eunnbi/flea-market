import styled from '@emotion/styled';
import { Avatar, Button, Tooltip } from '@mui/material';
import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { searchState } from 'store/searchState';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const SellerFilter = ({ sellers }: { sellers: User[] }) => {
  const [state, setState] = useRecoilState(searchState);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id === undefined) return;
    setState(state => ({ ...state, sellerId: id }));
  };
  return (
    <Div>
      <h4>Sellers</h4>
      <div>
        {sellers.map(seller => (
          <Button
            key={seller.userId}
            className={state.sellerId === seller.userId ? 'selected' : ''}
            onClick={onClick}
            data-id={seller.userId}>
            <Avatar {...stringAvatar(seller.name)} />
            <span>{seller.name.split(' ')[0]}</span>
          </Button>
        ))}
      </div>
    </Div>
  );
};

const Div = styled.div`
  width: 100%;
  h4 {
    font-weight: 500;
    margin-bottom: 10px;
  }
  & > div {
    display: flex;
    align-items: center;
  }
  button {
    display: flex;
    flex-direction: column;
  }
  span {
    color: gray;
  }
  .selected {
    div {
      border: 2px solid #000;
    }
    span {
      font-weight: bold;
      color: #000;
    }
  }
`;

export default SellerFilter;
