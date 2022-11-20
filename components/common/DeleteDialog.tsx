import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  onDelete: () => Promise<void>;
}

export const DeleteDialog = ({ open, handleClose, onDelete }: Props) => {
  const [loading, setLoading] = useState(false);
  const onConfirm = () => {
    setLoading(true);
    onDelete().then(() => {
      setLoading(false);
      handleClose();
    });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{loading ? '삭제 중...' : '정말 삭제하시겠습니까?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" disabled={loading}>
          취소
        </Button>
        <Button onClick={onConfirm} autoFocus color="secondary" disabled={loading}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};
