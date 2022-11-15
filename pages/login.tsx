import CustomHead from '@components/common/CustomHead';
import styles from '@styles/Auth.module.css';
import LoginForm from '@components/LoginForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert } from '@mui/material';

const Login = () => {
  const router = useRouter();
  const { signUp } = router.query;
  const [show, setShow] = useState(true);
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, []);
  return (
    <>
      <CustomHead title="Login" />
      <main className={styles.main}>
        <h1>로그인</h1>
        {show && signUp ? <Alert>회원가입 성공!</Alert> : null}
        <LoginForm />
      </main>
    </>
  );
};

export default Login;
