import CustomHead from '@components/common/CustomHead';
import styles from '@styles/Auth.module.css';
import RegisterForm from '@components/RegisterForm';
import { useEffect } from 'react';

const Register = () => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="Register" />
      <main className={styles.main}>
        <h1>회원가입</h1>
        <RegisterForm />
      </main>
    </>
  );
};

export default Register;
