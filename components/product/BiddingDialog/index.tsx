import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { productAPI } from "api/product";
import Router from "next/router";
import { useState } from "react";
import { BiddingCreateRequest } from "types/product";
import { useValidation } from "./useValidation";

export interface Props extends Pick<BiddingCreateRequest, "productId"> {
  maxPrice: number;
  handleClose: () => void;
}

const BiddingDialog = ({ productId, maxPrice, handleClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const { errorText, validate, initializeErrorText } = useValidation();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };
  const onClickCancelButton = () => {
    setPrice("");
    setLoading(false);
    initializeErrorText();
    handleClose();
  };
  const onClickConfirmButton = async () => {
    if (!validate({ price, maxPrice })) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await productAPI.createBidding({
        productId,
        price: Number(price),
      });
      const { success } = data;
      if (success) {
        Router.replace(
          `/products/${productId}?alert=🎉 입찰 완료되었습니다!`,
          `/products/${productId}`
        );
        setPrice("");
        setLoading(false);
        handleClose();
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
          onClick={onClickConfirmButton}
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
