import { Alert, Button } from "@mui/material";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { User } from "@prisma/client";
import Router from "next/router";
import CustomInput from "../common/CustomInput";
import { noError, createErrorObject } from "@lib/createErrorObject";
import axios from "axios";
import { getRedirectInfo } from "@lib/getRedirectInfo";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSetRecoilState } from "recoil";
import { loginFormState } from "@store/auth/loginFormState";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
  });
  const setLoginFormState = useSetRecoilState(loginFormState);
  const handleChange =
    (prop: keyof LoginFormState) =>
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
        setLoginError("");
        let isSuccess = false;
        axios
          .post<{ success: boolean; user: User }>("/api/auth/login", state)
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
              setLoginError("아이디 혹은 비밀번호가 일치하지 않습니다.");
              return state;
            }
          })
          .catch(() => {
            setLoading(false);
            setLoginError("아이디 혹은 비밀번호가 일치하지 않습니다.");
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

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <CloseButton
          type="button"
          onClick={() => Router.replace(window.location.pathname)}
        >
          <IoClose />
        </CloseButton>
        <h1>로그인</h1>
        {loginError ? <Alert severity="error">{loginError}</Alert> : null}
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
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <Link href="/register">회원가입하러 가기</Link>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 1px 5px 10px 0px rgba(0, 0, 0, 0.3);
  h1 {
    text-align: center;
  }
  a {
    text-align: center;
    font-size: 0.9rem;
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  svg {
    font-size: 1.5rem;
  }
`;

export default LoginForm;
