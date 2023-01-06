import CustomHead from "@components/common/CustomHead";
import styles from "@styles/Main.module.css";
import RegisterForm from "@components/auth/RegisterForm";
import { useEffect } from "react";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "@components/common/Header";
import { useResetRecoilState } from "recoil";
import { registerFormState } from "@store/auth/registerFormState";
import { userAPI } from "api/user";

const Register = ({
  isLogin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const resetRegisterFormState = useResetRecoilState(registerFormState);
  useEffect(() => {
    resetRegisterFormState();
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { data } = await userAPI.verify({
    absoluteUrl,
    token: cookies.access_token,
  });
  const { verify, user } = data;
  if (verify && user) {
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
