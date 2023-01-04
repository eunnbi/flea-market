import CustomHead from "@components/common/CustomHead";
import styles from "@styles/Register.module.css";
import RegisterForm from "@components/auth/RegisterForm";
import { useEffect } from "react";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { useResetRecoilState } from "recoil";
import { registerFormState } from "@store/auth/registerFormState";

const Register = ({
  isLogin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const resetRegisterFormState = useResetRecoilState(registerFormState);
  useEffect(() => {
    resetRegisterFormState();
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);
  return (
    <>
      <CustomHead title="Register" />
      <Header isLogin={isLogin} />
      <main className={styles.main}>
        <h1 className="font-bold text-2xl">회원가입</h1>
        <RegisterForm />
      </main>
    </>
  );
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token
        ? `Bearer ${cookies.access_token}`
        : "Bearer",
    },
  });
  const { verify, user } = await response.json();
  if (verify) {
    if (user.role === "SELLER") {
      return {
        redirect: {
          destination: "/sell",
          permanent: false,
        },
      };
    }
    if (user.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
  }
  return { props: { isLogin: verify } };
};

export default Register;
