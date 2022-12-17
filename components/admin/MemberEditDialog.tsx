import styled from "@emotion/styled";
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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { memberEditState } from "@store/admin/memberEditState";
import { membersState } from "@store/admin/membersState";
import { alertMessageState } from "@store/admin/alertMessageState";
import axios from "axios";

const MemberEditDialog = () => {
  const [{ open, id, initialState }, setMemberEditState] =
    useRecoilState(memberEditState);
  const setMembers = useSetRecoilState(membersState);
  const setAlertMessage = useSetRecoilState(alertMessageState);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const handleChange =
    (prop: keyof MemberTableState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((values) => ({ ...values, [prop]: event.target.value }));
    };
  const handleClose = () =>
    setMemberEditState((state) => ({ ...state, open: false }));
  const onCancel = () => {
    setErrorMessage("");
    handleClose();
    setLoading(false);
  };
  const onConfirm = async () => {
    if (
      values.userId === "" ||
      values.firstName === "" ||
      values.lastName === ""
    ) {
      setErrorMessage("빈 항목이 존재합니다.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    try {
      await axios.patch(`/api/user/${id}`, values);
      const { data } = await axios.get(`/api/user`);
      setMembers(data);
      setAlertMessage("수정이 완료되었습니다.");
      setLoading(false);
      handleClose();
    } catch (e) {
      setLoading(false);
      setErrorMessage("중복된 아이디입니다.");
    }
  };
  useEffect(() => {
    setValues(initialState);
  }, [initialState]);
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontFamily: "Pretendard" }}>
        {loading ? "정보 수정 중..." : "멤버 정보 수정"}
      </DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Form>
          <TextField
            label="ID"
            variant="standard"
            name="userId"
            onChange={handleChange("userId")}
            value={values.userId}
          />
          <TextField
            label="First Name"
            variant="standard"
            name="firstName"
            onChange={handleChange("firstName")}
            value={values.firstName}
          />
          <TextField
            label="Last Name"
            variant="standard"
            name="lastName"
            onChange={handleChange("lastName")}
            value={values.lastName}
          />
          <FormControl>
            <FormLabel id="role">Role</FormLabel>
            <RadioGroup
              name="role"
              defaultValue={initialState.role}
              onChange={handleChange("role")}
            >
              <FormControlLabel
                value="SELLER"
                control={<Radio size="small" />}
                label="Seller"
              />
              <FormControlLabel
                value="BUYER"
                control={<Radio size="small" />}
                label="Buyer"
              />
              <FormControlLabel
                value="ADMIN"
                control={<Radio size="small" />}
                label="Admin"
              />
            </RadioGroup>
          </FormControl>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color="error"
          type="button"
          disabled={loading}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          color="secondary"
          type="button"
          disabled={loading}
        >
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
export default MemberEditDialog;
