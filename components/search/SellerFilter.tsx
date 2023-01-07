import {
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { BiUser } from "react-icons/bi";
import { sellerState } from "@store/search/sellerState";
import { SellersGetResponse } from "types/user";

const SellerFilter = ({ sellers }: { sellers: SellersGetResponse }) => {
  const [open, setOpen] = useState(false);
  const [seller, setSeller] = useRecoilState(sellerState);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { id, name } = e.currentTarget.dataset;
    if (id === undefined || name === undefined) return;
    setSeller({ id, name });
    handleClose();
  };
  const onDelete = () => {
    setSeller({ id: "", name: "" });
  };
  return (
    <>
      <Chip
        icon={<BiUser />}
        label={`판매자 : ${seller.name}`}
        variant={seller.name === "" ? "outlined" : "filled"}
        onClick={handleOpen}
        onDelete={seller.name === "" ? undefined : onDelete}
        sx={{ textTransform: "capitalize" }}
        className="filterChip"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">판매자</DialogTitle>
        <DialogContent>
          <List>
            {sellers.map((seller) => (
              <ListItem
                disablePadding
                key={seller.id}
                data-id={seller.id}
                data-name={`${seller.firstName} ${seller.lastName}`}
                onClick={onClick}
              >
                <ListItemButton sx={{ display: "flex", gap: "1rem" }}>
                  <ListItemText
                    primary={`${seller.firstName} ${seller.lastName}`}
                    secondary={`⭐ ${seller.rating}`}
                    sx={{ textTransform: "capitalize" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(SellerFilter);
