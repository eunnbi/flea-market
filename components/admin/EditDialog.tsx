import styled from '@emotion/styled';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Alert,
} from '@mui/material';
import { User } from '@prisma/client';
import { useState, useEffect } from 'react';

type State = Pick<User, 'userId' | 'firstName' | 'lastName' | 'role'>;
interface Props {
  open: boolean;
  handleClose: () => void;
  initialState: State;
  editMember: (state: State) => Promise<void>;
}

const EditDialog = ({ open, handleClose, initialState, editMember }: Props) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(values => ({ ...values, [prop]: event.target.value }));
  };
  const onClose = () => {
    setMessage('');
    handleClose();
    setLoading(false);
  };
  const onConfirm = () => {
    if (values.userId === '' || values.firstName === '' || values.lastName === '') {
      setMessage('빈 항목이 존재합니다.');
      return;
    }
    setMessage('');
    setLoading(true);
    editMember(values)
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch(e => {
        setLoading(false);
        setMessage('중복된 아이디입니다.');
      });
  };
  useEffect(() => {
    setValues(initialState);
  }, [initialState]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'Pretendard' }}>
        {loading ? '정보 수정 중...' : '멤버 정보 수정'}
      </DialogTitle>
      <DialogContent>
        {message && <Alert severity="error">{message}</Alert>}
        <Form>
          <TextField
            label="ID"
            variant="standard"
            name="userId"
            onChange={handleChange('userId')}
            value={values.userId}
          />
          <TextField
            label="First Name"
            variant="standard"
            name="firstName"
            onChange={handleChange('firstName')}
            value={values.firstName}
          />
          <TextField
            label="Last Name"
            variant="standard"
            name="lastName"
            onChange={handleChange('lastName')}
            value={values.lastName}
          />
          <FormControl>
            <FormLabel id="role">Role</FormLabel>
            <RadioGroup name="role" defaultValue={initialState.role} onChange={handleChange('role')}>
              <FormControlLabel value="SELLER" control={<Radio size="small" />} label="Seller" />
              <FormControlLabel value="BUYER" control={<Radio size="small" />} label="Buyer" />
              <FormControlLabel value="ADMIN" control={<Radio size="small" />} label="Admin" />
            </RadioGroup>
          </FormControl>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" type="button" disabled={loading}>
          취소
        </Button>
        <Button onClick={onConfirm} autoFocus color="secondary" type="button" disabled={loading}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
`;
export default EditDialog;
