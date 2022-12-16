import { IconButton, Menu, MenuItem } from '@mui/material';
import { BiSortDown } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { sortFilterState } from '@store/sortFilterState';
import { productsState } from '@store/productsState';

const SortFilter = () => {
  const setProducts = useSetRecoilState(productsState);
  const [sort, setSort] = useRecoilState(sortFilterState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    
  };
  const handleClose = (e: React.MouseEvent<HTMLLIElement>) => {
    if (e.currentTarget.textContent) {
      setSort(e.currentTarget.textContent as "최신순" | "좋아요순");
    }
    setAnchorEl(null);
  };
  useEffect(() => {
    setProducts(({ initialProducts }) => sort === "최신순" ? ({ initialProducts, products: [...initialProducts].sort(({ createdAt: a }, { createdAt: b }) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    })}) : ({ initialProducts, products: [...initialProducts].sort(({ likeCnt: a }, { likeCnt: b }) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    })}))
  }, [sort]);
  return (
    <Div>
      <span>{sort}</span>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
        <BiSortDown />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={handleClose}>최신순</MenuItem>
        <MenuItem onClick={handleClose}>좋아요순</MenuItem>
      </Menu>
    </Div>
  );
};

const Div = styled.div`
  align-self: flex-end;
  margin-top: 1rem;
`;

export default React.memo(SortFilter);
