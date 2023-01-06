import { noError, createErrorObject } from "@lib/createErrorObject";
import { registerFormState } from "@store/auth/registerFormState";
import { authAPI } from "api/auth";
import Router from "next/router";
import { useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { RegisterRequest } from "types/auth";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    userId: noError,
    password: noError,
    firstName: noError,
    lastName: noError,
  });
  const [helperText, setHelperText] = useState({
    userId: "",
    password: "영문자와 숫자 포함, 8자 이상 15자 이하",
    firstName: "",
    lastName: "",
  });
  const setRegisterFormState = useSetRecoilState(registerFormState);
  const isCheckIdDuplicate = useRef(false);
  const isIdDuplicate = useRef(false);

  const handleChange =
    (prop: keyof RegisterRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterFormState((values) => ({
        ...values,
        [prop]: event.target.value,
      }));
    };

  const checkIdDuplicate = () => {
    setRegisterFormState((state) => {
      const { userId } = state;
      if (userId === "") {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          userId: createErrorObject("아이디를 입력하세요"),
        }));
        return state;
      }
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        userId: noError,
      }));
      authAPI.idDuplicate(userId).then(({ data }) => {
        const { idDuplicate } = data;
        isIdDuplicate.current = idDuplicate;
        if (idDuplicate) {
          setHelperText((text) => ({ ...text, userId: "" }));
          setErrorInfo((errorInfo) => ({
            ...errorInfo,
            userId: createErrorObject("중복된 아이디입니다"),
          }));
        } else {
          setHelperText((text) => ({
            ...text,
            userId: "사용 가능한 아이디입니다.",
          }));
          setErrorInfo((errorInfo) => ({ ...errorInfo, userId: noError }));
        }
        isCheckIdDuplicate.current = true;
      });
      return state;
    });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterFormState((state) => {
      const { firstName, lastName, userId, password } = state;
      if (
        firstName === "" ||
        lastName === "" ||
        userId === "" ||
        password === ""
      ) {
        setErrorInfo({
          userId:
            userId === "" ? createErrorObject("아이디를 입력하세요") : noError,
          password:
            password === ""
              ? createErrorObject("비밀번호를 입력하세요")
              : noError,
          firstName:
            firstName === "" ? createErrorObject("이름을 입력하세요") : noError,
          lastName:
            lastName === "" ? createErrorObject("이름을 입력하세요") : noError,
        });
      } else if (!isCheckIdDuplicate.current) {
        setErrorInfo({
          userId: createErrorObject("아이디 중복 확인이 필요합니다."),
          password: noError,
          firstName: noError,
          lastName: noError,
        });
      } else if (isIdDuplicate.current) {
        setErrorInfo({
          userId: createErrorObject("중복된 아이디입니다"),
          password: noError,
          firstName: noError,
          lastName: noError,
        });
      } else if (!/(?=.*\d)(?=.*[a-zA-Z]).{8,15}/.test(password)) {
        // password 정규식 검사
        setErrorInfo({
          userId: noError,
          password: createErrorObject("비밀번호 형식과 맞지 않습니다."),
          firstName: noError,
          lastName: noError,
        });
      } else {
        setErrorInfo({
          userId: noError,
          password: noError,
          firstName: noError,
          lastName: noError,
        });
        // register api 호출
        setLoading(true);
        authAPI
          .register(state)
          .then(() => {
            setLoading(false);
            Router.push(
              `/?login=true&alert=🖤 회원가입에 성공하셨습니다.`,
              "/"
            );
          })
          .catch(() => {
            setLoading(false);
            alert("회원가입에 실패하였습니다. 다시 진행해주세요");
          });
      }
      return state;
    });
  };
  return {
    loading,
    errorInfo,
    helperText,
    handleChange,
    onSubmit,
    checkIdDuplicate,
  };
}
