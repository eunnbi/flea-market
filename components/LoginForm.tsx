import { Button } from '@mui/material';
import React, { useState } from 'react';
import styles from '@styles/Auth.module.css';
import { User } from '@prisma/client';
import Router from 'next/router';
import CustomInput from './common/CustomInput';
import { noError, createErrorObject } from '@lib/formValidation';

type State = Pick<User, 'userId' | 'password'>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
  });
  const [values, setValues] = useState<State>({
    userId: '',
    password: '',
  });
  const { userId, password } = values;
  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(values => ({ ...values, [prop]: event.target.value }));
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // form validation
    if (userId === '' || password == '') {
      setErrorInfo({
        userId: userId === '' ? createErrorObject('아이디를 입력하세요') : noError,
        password: password === '' ? createErrorObject('비밀번호를 입력하세요') : noError,
      });
    } else {
      setErrorInfo({ userId: noError, password: noError });
      // login api 호출
      setLoading(true);
      fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          const { success, user } = data;
          setLoading(false);
          if (success) {
            console.log(user);
            Router.push('/');
          } else {
            setLoginError('아이디 혹은 비밀번호가 일치하지 않습니다.');
          }
        });
    }
  };
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {loginError ? <p className={styles.message}>{loginError}</p> : null}
      <CustomInput
        label="ID"
        value={userId}
        onChange={handleChange('userId')}
        isPassword={false}
        htmlFor="userId"
        errorInfo={errorInfo.userId}
      />
      <CustomInput
        label="Password"
        value={password}
        onChange={handleChange('password')}
        isPassword={true}
        htmlFor="password"
        errorInfo={errorInfo.password}
      />
      <Button variant="contained" type="submit">
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
};

export default LoginForm;
