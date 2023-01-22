import {
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  FormHelperText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import Router from "next/router";
import { productAPI } from "@api/product";

interface Props {
  initialRating: number;
  id: string;
  handleClose: () => void;
}

const RatingDialog = ({ initialRating, id, handleClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [rating, setRating] = useState(initialRating);
  const onConfirm = async () => {
    if (rating === 0) {
      setErrorText("0점 평가는 불가합니다.");
      return;
    }
    try {
      setLoading(true);
      if (initialRating === 0) {
        await productAPI.createRating({
          productId: id,
          rating,
        });
      } else {
        await productAPI.updateRating({
          productId: id,
          rating,
        });
      }
      setLoading(false);
      handleClose();
      Router.replace("/shopping");
    } catch (e) {
      setLoading(false);
      handleClose();
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
        {loading
          ? "처리중..."
          : rating === 0
          ? "판매자 평가하기"
          : "평가 수정하기"}
      </DialogTitle>
      <DialogContent>
        <Rating
          defaultValue={initialRating}
          precision={0.5}
          onChange={(_, value) => setRating(value === null ? 0 : value)}
        />
        {errorText && <FormHelperText error>{errorText}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" disabled={loading}>
          취소
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          color="secondary"
          disabled={loading}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;
