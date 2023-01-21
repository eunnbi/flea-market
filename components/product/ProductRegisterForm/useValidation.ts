import { createErrorObject, noError } from "@lib/createErrorObject";
import { errorInfoState } from "@store/product/errorInfoState";
import { ProductForm } from "@store/product/productFormState";
import { useSetRecoilState } from "recoil";

export const useValidation = () => {
  const setErrorInfo = useSetRecoilState(errorInfoState);
  const validate = ({
    status,
    imageFile,
    name,
    content,
    tradingPlace,
    price,
    phoneNumber,
    location,
    imageId,
  }: Omit<ProductForm, "endingAt"> & {
    location: string;
    imageId?: string;
  }) => {
    if (imageFile === null && !imageId) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        imageFile: createErrorObject("사진을 업로드해주세요"),
      }));
      return;
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        imageFile: noError,
      }));
    }
    if (name === "") {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        name: createErrorObject("상품 이름을 입력해주세요"),
      }));
      return;
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        name: noError,
      }));
    }
    if (content === "") {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        content: createErrorObject("상품 설명을 입력해주세요"),
      }));
      return;
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        content: noError,
      }));
    }
    if (phoneNumber === "") {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        phoneNumber: createErrorObject("전화번호를 입력해주세요"),
      }));
      return;
    } else if (!/01[016789]-[^0][0-9]{3,4}-[0-9]{4}/.test(phoneNumber)) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        phoneNumber: createErrorObject("전화번호 형식에 맞춰 입력해주세요"),
      }));
      return;
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        phoneNumber: noError,
      }));
    }
    if (tradingPlace === "") {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: createErrorObject("거래 장소를 입력해주세요."),
      }));
      return;
    } else if (tradingPlace !== location) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: createErrorObject("옆에 있는 돋보기 버튼을 눌러주세요."),
      }));
      return;
    }
    if (status === "PROGRESS") {
      if (price === "") {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("상품 가격을 입력해주세요"),
        }));
        return;
      } else if (Number.isNaN(Number(price))) {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("숫자만 입력해주세요"),
        }));
        return;
      } else if (Number(price) < 0) {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("0 이상의 가격만 가능합니다."),
        }));
        return;
      } else {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: noError,
        }));
      }
    }
  };
  return { validate };
};
