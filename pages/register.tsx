import CustomHead from '@components/common/CustomHead';
import styles from '@styles/Auth.module.css';
import RegisterForm from '@components/RegisterForm';
import { useEffect } from 'react';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Header from '@components/common/Header';

const Register = ({ isLogin }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="Register" />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <h1>회원가입</h1>
        <RegisterForm />
      </main>
    </>
  );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer',
    },
  });
  const { verify, user } = await response.json();
  if (verify) {
    if (user.role === 'SELLER') {
      return {
        redirect: {
          destination: '/sell',
          permanent: false,
        },
      };
    }
    if (user.role === 'ADMIN') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
  }
  return { props: { isLogin: verify } };
};

export default Register;
