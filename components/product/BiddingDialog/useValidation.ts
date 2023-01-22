import { useState } from "react";

export const useValidation = () => {
  const [errorText, setErrorText] = useState("");
  const initializeErrorText = () => {
    setErrorText("");
  };
  const validate = ({
    price,
    maxPrice,
  }: {
    price: string;
    maxPrice: number;
  }) => {
    if (price === "") {
      setErrorText("입찰 가격을 입력해주세요");
      return false;
    }
    // Suggested bidding price must be higher than the current price
    if (Number(price) <= maxPrice) {
      setErrorText("현재 가장 높은 입찰 가격보다 작습니다. 다시 입력해주세요");
      return false;
    }
    initializeErrorText();
    return true;
  };
  return { errorText, validate, initializeErrorText };
};
