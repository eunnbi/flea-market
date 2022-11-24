import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => Promise<void>;
  basicTitle: string;
  loadingTitle: string;
  content: string;
}

const SimpleDialog = ({ open, handleClose, onConfirm, basicTitle, loadingTitle, content }: Props) => {
  const [loading, setLoading] = useState(false);
  const onClickOkButton = () => {
    setLoading(true);
    onConfirm().then(() => {
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
      <DialogTitle id="alert-dialog-title">{loading ? loadingTitle : basicTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" disabled={loading}>
          취소
        </Button>
        <Button onClick={onClickOkButton} autoFocus color="secondary" disabled={loading}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleDialog;
