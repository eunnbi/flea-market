import {
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  FormHelperText,
  DialogActions,
  Button,
} from "@mui/material";
import { ratingState } from "@store/ratingState";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";

const RatingDialog = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [rating, setRating] = useState(0);
  const [{ open, id, initialRating }, setRatingState] =
    useRecoilState(ratingState);
  const handleClose = () => {
    setRatingState({
      open: false,
      initialRating: 0,
      id: "",
    });
    setErrorText("");
  };
  const onConfirm = async () => {
    if (rating === 0) {
      setErrorText("0점 평가는 불가합니다.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.patch(`/api/product/buy/${id}`, {
        rating,
      });
      setLoading(false);
      handleClose();
      Router.replace("/shopping");
    } catch (e) {
      setLoading(false);
      handleClose();
    }
  };
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);
  return (
    <Dialog
      open={open}
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
