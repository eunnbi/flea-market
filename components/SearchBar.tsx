import styled from '@emotion/styled';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
  Slider,
} from '@mui/material';
import React, { useState } from 'react';
import { BiSearchAlt, BiFilterAlt } from 'react-icons/bi';
import { useRecoilState } from 'recoil';
import { searchState } from 'store/searchState';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useRecoilState(searchState);
  const handleClose = () => setOpen(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(state => ({ ...state, keyword: e.currentTarget.value }));
  };
  return (
    <>
      <Div>
        <Input placeholder="상품 이름 검색" onChange={onChange} value={state.name} />
        <IconButton>
          <BiSearchAlt />
        </IconButton>
        <IconButton onClick={() => setOpen(true)}>
          <BiFilterAlt />
        </IconButton>
      </Div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">가격</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Slider />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            취소
          </Button>
          <Button onClick={handleClose} autoFocus color="secondary">
            적용
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Div = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  & > div {
    flex-grow: 1;
  }
  svg {
    font-size: 1.5rem;
  }
`;

export default SearchBar;
