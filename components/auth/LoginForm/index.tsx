import { Alert, Button } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Router from "next/router";
import CustomInput from "../../common/CustomInput";
import Link from "next/link";
import useLogin from "./useLogin";

const LoginForm = () => {
  const { loading, errorInfo, errorMessage, onSubmit, handleChange } =
    useLogin();

  return (
    <div className="fixed inset-0 z-10 bg-modal flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="relative flex flex-col gap-6 bg-white p-8 rounded shadow-xl"
      >
        <button
          className="absolute top-2.5 right-2.5"
          type="button"
          onClick={() => Router.replace(window.location.pathname)}
        >
          <IoClose className="text-2xl" />
        </button>
        <h1 className="text-center font-bold text-2xl">로그인</h1>
        {errorMessage ? (
          <Alert severity="error" className="flex items-center">
            {errorMessage}
          </Alert>
        ) : null}
        <CustomInput
          label="ID"
          onChange={handleChange("userId")}
          isPassword={false}
          htmlFor="userId"
          errorInfo={errorInfo.userId}
        />
        <CustomInput
          label="Password"
          onChange={handleChange("password")}
          isPassword={true}
          htmlFor="password"
          errorInfo={errorInfo.password}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          className="bg-black"
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <Link href="/register" className="text-center text-sm underline">
          회원가입하러 가기
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
