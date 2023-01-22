import { IconButton, Menu, MenuItem } from "@mui/material";
import { BiSortDown } from "react-icons/bi";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { sortFilterState } from "@store/sortFilterState";

const SortFilter = () => {
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
  return (
    <div className="mt-4 self-end">
      <span>{sort}</span>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <BiSortDown />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>최신순</MenuItem>
        <MenuItem onClick={handleClose}>좋아요순</MenuItem>
      </Menu>
    </div>
  );
};

export default React.memo(SortFilter);
