import { noError, createErrorObject } from "@lib/createErrorObject";
import { getRedirectInfo } from "@lib/getRedirectInfo";
import { loginFormState } from "@store/auth/loginFormState";
import { authAPI } from "@api/auth";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { LoginRequest } from "types/auth";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
  });
  const setLoginFormState = useSetRecoilState(loginFormState);
  const handleChange =
    (prop: keyof LoginRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoginFormState((values) => ({
        ...values,
        [prop]: event.target.value,
      }));
    };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginFormState((state) => {
      const { userId, password } = state;
      // form validation
      if (userId === "" || password == "") {
        setErrorInfo({
          userId:
            userId === "" ? createErrorObject("아이디를 입력하세요") : noError,
          password:
            password === ""
              ? createErrorObject("비밀번호를 입력하세요")
              : noError,
        });
        return state;
      } else {
        setErrorInfo({ userId: noError, password: noError });
        // login api 호출
        setLoading(true);
        setErrorMessage("");
        let isSuccess = false;
        authAPI
          .login(state)
          .then(({ data }) => {
            const { success, user } = data;
            setLoading(false);
            if (success) {
              isSuccess = true;
              const info = getRedirectInfo("/login", user.role);
              if (info) {
                window.location.replace(info.destination);
              }
              return { userId: "", password: "" };
            } else {
              setErrorMessage("아이디 혹은 비밀번호가 일치하지 않습니다.");
              return state;
            }
          })
          .catch(() => {
            setLoading(false);
            setErrorMessage("아이디 혹은 비밀번호가 일치하지 않습니다.");
            return state;
          });
        if (isSuccess) {
          return { userId: "", password: "" };
        } else {
          return state;
        }
      }
    });
  };
  return {
    loading,
    errorMessage,
    errorInfo,
    handleChange,
    onSubmit,
  };
}
