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
import { BiSearchAlt } from 'react-icons/bi';
import { IoCloseCircle } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { searchState } from 'store/searchState';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [state, setState] = useRecoilState(searchState);
  const handleClose = () => setOpen(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const onClickSearchButton = () => {
    setInput(input => {
      setState(state => ({ ...state, name: input }));
      return input;
    });
  };
  const onClickClearButton = () => {
    setInput(() => {
      setState(state => ({ ...state, name: '' }));
      return '';
    });
  };
  return (
    <>
      <Div>
        <Input
          placeholder="상품 이름 검색"
          onChange={onChange}
          value={input}
          endAdornment={
            state.name !== '' && (
              <IconButton onClick={onClickClearButton}>
                <IoCloseCircle />
              </IconButton>
            )
          }
        />
        <IconButton onClick={onClickSearchButton}>
          <BiSearchAlt />
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
