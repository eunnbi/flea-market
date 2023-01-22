import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MdOutlineAttachMoney } from "react-icons/md";
import { priceState } from "@store/search/priceState";

const PRICE_FILTER: { startPrice: number; lastPrice: number }[] = [
  {
    startPrice: 0,
    lastPrice: 30000,
  },
  {
    startPrice: 30000,
    lastPrice: 50000,
  },
  {
    startPrice: 50000,
    lastPrice: 70000,
  },
  {
    startPrice: 70000,
    lastPrice: 100000,
  },
  {
    startPrice: 100000,
    lastPrice: 0,
  },
];

const PriceFilter = () => {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useRecoilState(priceState);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { min, max } = e.currentTarget.dataset;
    if (min == undefined || max == undefined) return;
    setPrice({ startPrice: Number(min), lastPrice: Number(max) });
    handleClose();
  };
  const initialize = () => {
    setPrice({ startPrice: 0, lastPrice: 0 });
  };
  const { startPrice, lastPrice } = price;
  return (
    <>
      <Chip
        icon={<MdOutlineAttachMoney />}
        label={`가격: ${
          startPrice === 0 && lastPrice === 0
            ? ""
            : `${startPrice.toLocaleString()} ~ ${
                lastPrice === 0 ? "" : lastPrice.toLocaleString()
              }`
        }`}
        variant={startPrice === 0 && lastPrice === 0 ? "outlined" : "filled"}
        onClick={handleOpen}
        onDelete={startPrice === 0 && lastPrice === 0 ? undefined : initialize}
        className="filterChip"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">가격</DialogTitle>
        <DialogContent>
          <List>
            {PRICE_FILTER.map((filter) => (
              <ListItem
                disablePadding
                key={filter.startPrice}
                onClick={onClick}
                data-min={filter.startPrice}
                data-max={filter.lastPrice}
              >
                <ListItemButton>
                  <ListItemText
                    primary={`${
                      filter.startPrice === 0
                        ? ""
                        : `${filter.startPrice.toLocaleString()}원`
                    } ~ ${
                      filter.lastPrice === 0
                        ? ""
                        : `${filter.lastPrice.toLocaleString()}원`
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <PriceInputs handleClose={handleClose} />
      </Dialog>
    </>
  );
};

const PriceInputs = ({ handleClose }: { handleClose: () => void }) => {
  const setPrice = useSetRecoilState(priceState);
  const [errorText, setErrorText] = useState("");
  const [inputs, setInputs] = useState({
    min: "",
    max: "",
  });
  const handleChange =
    (type: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputs((inputs) => ({
        ...inputs,
        [type]: e.target.value,
      }));
    };
  const onClick = () => {
    const { min, max } = inputs;
    if (min === "" || max === "") {
      setErrorText("숫자를 입력해주세요");
      return;
    } else if (Number(min) > Number(max)) {
      setErrorText("오른쪽 필드값이 왼쪽 필드값보다 같거나 커야 합니다.");
      return;
    }
    setErrorText("");
    setPrice({
      startPrice: Number(min),
      lastPrice: Number(max),
    });
    handleClose();
  };
  return (
    <>
      <div className="flex items-center gap-4 px-5">
        <OutlinedInput
          sx={{ width: "150px" }}
          type="number"
          onChange={handleChange("min")}
        />
        <span>~</span>
        <OutlinedInput
          sx={{ width: "150px" }}
          type="number"
          onChange={handleChange("max")}
        />
      </div>
      {errorText && (
        <FormHelperText sx={{ padding: "0 20px" }} error>
          {errorText}
        </FormHelperText>
      )}
      <DialogActions>
        <Button onClick={onClick}>적용</Button>
      </DialogActions>
    </>
  );
};

export default React.memo(PriceFilter);
