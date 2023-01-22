import { IconButton, Input } from "@mui/material";
import { nameState } from "@store/search/nameState";
import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { IoCloseCircle } from "react-icons/io5";
import { useRecoilState } from "recoil";

const SearchBar = () => {
  const [name, setName] = useRecoilState(nameState);
  const [input, setInput] = useState(name);
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
    <div className="max-w-3xl w-full flex items-center gap-4">
      <Input
        className="flex-1"
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
        <BiSearchAlt className="text-xl" />
      </IconButton>
    </div>
  );
};

export default React.memo(SearchBar);
