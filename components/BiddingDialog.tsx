import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  onConfirm: (price: number) => Promise<void>;
  maxPrice: number;
}

const BiddingDialog = ({ open, handleClose, onConfirm, maxPrice }: Props) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState('');
  const [errorText, setErrorText] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };
  const onClickCancelButton = () => {
    setErrorText('');
    setPrice('');
    handleClose();
  };
  const onClickOkButton = () => {
    if (price === '') {
      setErrorText('입찰 가격을 입력해주세요');
      return;
    }
    //Suggested bidding price must be higher than the current price
    if (Number(price) <= maxPrice) {
      setErrorText('현재 가장 높은 입찰 가격보다 작습니다. 다시 입력해주세요');
      return;
    }
    setErrorText('');
    setLoading(true);
    onConfirm(Number(price)).then(() => {
      handleClose();
      setPrice('');
    });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{loading ? '처리 중...' : '입찰 가격'}</DialogTitle>
      <DialogContent>
        <OutlinedInput type="number" value={price} onChange={onChange} />
        {errorText && <FormHelperText error>{errorText}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickCancelButton} color="error" disabled={loading}>
          취소
        </Button>
        <Button onClick={onClickOkButton} autoFocus color="secondary" disabled={loading}>
          입력
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BiddingDialog;
