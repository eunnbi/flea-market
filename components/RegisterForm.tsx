import { FormControl, Button, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useRef, useState } from 'react';
import styles from '@styles/Auth.module.css';
import type { User } from '@prisma/client';
import CustomInput from './common/CustomInput';
import { noError, createErrorObject } from '@lib/formValidation';

type State = Pick<User, 'userId' | 'password' | 'name' | 'role'>;

const RegisterForm = () => {
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
    name: noError,
  });
  const [helperText, setHelperText] = useState({
    userId: '',
    password: '영문자 및 숫자 포함, 8자 이상 15자 이하',
    name: '',
  });
  const [values, setValues] = useState<Pick<User, 'userId' | 'password' | 'name' | 'role'>>({
    name: '',
    role: 'SELLER',
    userId: '',
    password: '',
  });
  const isIdDuplicate = useRef(false);
  const { name, userId, password } = values;
  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(values => ({ ...values, [prop]: event.target.value }));
  };
  const checkIdDuplicate = () => {
    if (userId === '') {
      setErrorInfo(errorInfo => ({
        ...errorInfo,
        userId: createErrorObject('아이디를 입력하세요'),
      }));
      return;
    }
    setErrorInfo(errorInfo => ({
      ...errorInfo,
      userId: noError,
    }));
    fetch(`/api/auth/idDuplicate?userId=${userId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const { idDuplicate } = data;
        isIdDuplicate.current = idDuplicate;
        if (idDuplicate) {
          setHelperText(text => ({ ...text, userId: '' }));
          setErrorInfo(errorInfo => ({ ...errorInfo, userId: createErrorObject('중복된 아이디입니다') }));
        } else {
          setHelperText(text => ({ ...text, userId: '사용 가능한 아이디입니다.' }));
          setErrorInfo(errorInfo => ({ ...errorInfo, userId: noError }));
        }
      });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === '' || userId === '' || password === '') {
      setErrorInfo({
        userId: userId === '' ? createErrorObject('아이디를 입력하세요') : noError,
        password: password === '' ? createErrorObject('비밀번호를 입력하세요') : noError,
        name: name === '' ? createErrorObject('이름을 입력하세요') : noError,
      });
    } else if (isIdDuplicate.current) {
      setErrorInfo(errorInfo => ({ ...errorInfo, userId: createErrorObject('중복된 아이디입니다') }));
    } else if (password) {
      // password 정규식 검사
    } else {
      setErrorInfo({
        userId: noError,
        password: noError,
        name: noError,
      });
    }
  };
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <CustomInput
        label="Name"
        htmlFor="name"
        value={name}
        onChange={handleChange('name')}
        isPassword={false}
        errorInfo={errorInfo.name}
      />
      <div className={styles.row}>
        <CustomInput
          label="ID"
          htmlFor="userId"
          value={userId}
          onChange={handleChange('userId')}
          isPassword={false}
          errorInfo={errorInfo.userId}
          helperText={helperText.userId}
        />
        <Button variant="outlined" sx={{ flexShrink: 0 }} type="button" onClick={checkIdDuplicate}>
          중복 확인
        </Button>
      </div>
      <CustomInput
        label="Password"
        htmlFor="password"
        value={password}
        onChange={handleChange('password')}
        isPassword={true}
        errorInfo={errorInfo.password}
        helperText={helperText.password}
      />
      <FormControl>
        <FormLabel id="role">Role</FormLabel>
        <RadioGroup row name="role" defaultValue="SELLER" onChange={handleChange('role')}>
          <FormControlLabel value="SELLER" control={<Radio size="small" />} label="Seller" />
          <FormControlLabel value="BUYER" control={<Radio size="small" />} label="Buyer" />
        </RadioGroup>
      </FormControl>
      <Button variant="contained" type="submit">
        Sign Up
      </Button>
    </form>
  );
};

export default RegisterForm;
