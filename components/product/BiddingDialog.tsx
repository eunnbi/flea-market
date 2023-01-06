import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import Router from "next/router";
import { useState } from "react";

export interface Props {
  id: string;
  maxPrice: number;
  handleClose: () => void;
}

const BiddingDialog = ({ id, maxPrice, handleClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [errorText, setErrorText] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };
  const onClickCancelButton = () => {
    setErrorText("");
    setPrice("");
    setLoading(false);
    handleClose();
  };
  const onClickOkButton = async () => {
    if (price === "") {
      setErrorText("입찰 가격을 입력해주세요");
      return;
    }
    //Suggested bidding price must be higher than the current price
    if (Number(price) <= maxPrice) {
      setErrorText("현재 가장 높은 입찰 가격보다 작습니다. 다시 입력해주세요");
      return;
    }
    setErrorText("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/product/bid", {
        price: Number(price),
        productId: id,
      });

      const { success } = data;
      if (success) {
        Router.replace(
          `/products/${id}?alert=🎉 입찰 완료되었습니다!`,
          `/products/${id}`
        );
        handleClose();
        setPrice("");
        setLoading(false);
      } else {
        setLoading(false);
        alert("⚠️ 입찰에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      setLoading(false);
      alert("⚠️ 입찰에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {loading ? "처리 중..." : "입찰 가격"}
      </DialogTitle>
      <DialogContent>
        <OutlinedInput type="number" value={price} onChange={onChange} />
        {errorText && <FormHelperText error>{errorText}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancelButton} color="error" disabled={loading}>
          취소
        </Button>
        <Button
          onClick={onClickOkButton}
          autoFocus
          color="secondary"
          disabled={loading}
        >
          입력
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BiddingDialog;
