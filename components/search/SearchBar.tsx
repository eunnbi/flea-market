import styled from "@emotion/styled";
import { IconButton, Input } from "@mui/material";
import { nameState } from "@store/search/nameState";
import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { IoCloseCircle } from "react-icons/io5";
import { useRecoilState } from "recoil";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [name, setName] = useRecoilState(nameState);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const onClickSearchButton = () => {
    setName(input);
  };
  const onClickClearButton = () => {
    setName("");
    setInput("");
  };
  return (
    <Div>
      <Input
        placeholder="상품 이름 검색"
        onChange={onChange}
        value={input}
        endAdornment={
          name !== "" && (
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
  );
};

const Div = styled.div`
  max-width: 720px;
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

export default React.memo(SearchBar);
