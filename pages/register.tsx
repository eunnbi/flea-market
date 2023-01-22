import CustomHead from "@components/common/CustomHead";
import styles from "@styles/Main.module.css";
import RegisterForm from "@components/auth/RegisterForm";
import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { useResetRecoilState } from "recoil";
import { registerFormState } from "@store/auth/registerFormState";
import { verifyUser } from "@lib/verifyUser";

const Register = () => {
  const resetRegisterFormState = useResetRecoilState(registerFormState);
  useEffect(() => {
    resetRegisterFormState();
  }, []);
  return (
    <>
      <CustomHead title="Register" />
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
  const { redirect, isLogin } = await verifyUser(req, {
    role: "BUYER",
    login: false,
  });
  if (redirect) {
    return {
      redirect,
    };
  }
  return { props: { isLogin } };
};

export default Register;
