import CustomHead from '@components/common/CustomHead';
import styles from '@styles/Auth.module.css';
import LoginForm from '@components/LoginForm';
import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="Login" />
      <main className={styles.main}>
        <h1>로그인</h1>
        <LoginForm />
      </main>
    </>
  );
};

export default Login;
