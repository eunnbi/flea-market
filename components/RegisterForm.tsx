import { FormControl, Button, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useRef, useState } from 'react';
import styles from '@styles/RegisterForm.module.css';
import type { User } from '@prisma/client';
import CustomInput from './common/CustomInput';
import { noError, createErrorObject } from '@lib/formValidation';
import Router from 'next/router';
import axios from 'axios';

type State = Pick<User, 'userId' | 'password' | 'firstName' | 'lastName' | 'role'>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
    firstName: noError,
    lastName: noError,
  });
  const [helperText, setHelperText] = useState({
    userId: '',
    password: '영문자와 숫자 포함, 8자 이상 15자 이하',
    firstName: '',
    lastName: '',
  });
  const [values, setValues] = useState<State>({
    firstName: '',
    lastName: '',
    role: 'SELLER',
    userId: '',
    password: '',
  });
  const isCheckIdDuplicate = useRef(false);
  const isIdDuplicate = useRef(false);
  const { firstName, lastName, userId, password } = values;
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
        isCheckIdDuplicate.current = true;
      });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (firstName === '' || lastName === '' || userId === '' || password === '') {
      setErrorInfo({
        userId: userId === '' ? createErrorObject('아이디를 입력하세요') : noError,
        password: password === '' ? createErrorObject('비밀번호를 입력하세요') : noError,
        firstName: firstName === '' ? createErrorObject('이름을 입력하세요') : noError,
        lastName: lastName === '' ? createErrorObject('이름을 입력하세요') : noError,
      });
    } else if (!isCheckIdDuplicate.current) {
      setErrorInfo({
        userId: createErrorObject('아이디 중복 확인이 필요합니다.'),
        password: noError,
        firstName: noError,
        lastName: noError,
      });
    } else if (isIdDuplicate.current) {
      setErrorInfo({
        userId: createErrorObject('중복된 아이디입니다'),
        password: noError,
        firstName: noError,
        lastName: noError,
      });
    } else if (!/(?=.*\d)(?=.*[a-zA-ZS]).{8,15}/.test(password)) {
      // password 정규식 검사
      setErrorInfo({
        userId: noError,
        password: createErrorObject('비밀번호 형식과 맞지 않습니다.'),
        firstName: noError,
        lastName: noError,
      });
    } else {
      setErrorInfo({
        userId: noError,
        password: noError,
        firstName: noError,
        lastName: noError,
      });
      // register api 호출
      setLoading(true);
      try {
        await axios.post<{ success: boolean }>('/api/auth/register', {
          ...values,
        });
        setLoading(false);
        Router.push(`/?login=true&alert=🖤 회원가입에 성공하셨습니다.`, '/');
      } catch (e) {
        setLoading(false);
        alert('회원가입에 실패하였습니다. 다시 진행해주세요');
      }
    }
  };
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <CustomInput
        label="First Name"
        htmlFor="firstName"
        value={firstName}
        onChange={handleChange('firstName')}
        isPassword={false}
        errorInfo={errorInfo.firstName}
      />
      <CustomInput
        label="Last Name"
        htmlFor="lastName"
        value={lastName}
        onChange={handleChange('lastName')}
        isPassword={false}
        errorInfo={errorInfo.lastName}
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
      <Button variant="contained" type="submit" disabled={loading}>
        {loading ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  );
};

export default RegisterForm;
