import { noError, createErrorObject } from "@lib/createErrorObject";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { Product } from "@prisma/client";
import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../common/CustomInput";
import Map from "../common/Map";
import dayjs from "dayjs";
import CustomDatePicker from "./CustomDatePicker";
import { BiSearchAlt } from "react-icons/bi";
import ImageUpload from "./ImageUpload";
import styled from "@emotion/styled";
import axios from "axios";
import Router from "next/router";
import { getImageUrl } from "@lib/getImageUrl";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { productInputState } from "@store/product/inputState";
import { errorInfoState } from "@store/product/errorInfoState";
import { locationState } from "@store/locationState";
import { productStatusState } from "@store/product/statusState";
import StatusSelection from "./StatusSelection";
import { endingAtState } from "@store/product/endingAtState";
import { imageFileState } from "@store/product/imageFileState";

type State = Pick<
  Product,
  "name" | "phoneNumber" | "tradingPlace" | "status" | "content"
> & {
  price: string;
};

interface Props {
  initialProduct: ProductItem | null;
}

const ProductRegisterForm = ({ initialProduct }: Props) => {
  const [errorInfo, setErrorInfo] = useRecoilState(errorInfoState);
  const setProductInputState = useSetRecoilState(productInputState);
  const setLocationState = useSetRecoilState(locationState);
  const setStatusState = useSetRecoilState(productStatusState);
  const setEndingAtState = useSetRecoilState(endingAtState);
  const resetProductInputState = useResetRecoilState(productInputState);
  const resetLocationState = useResetRecoilState(locationState);
  const resetStatusState = useResetRecoilState(productStatusState);
  const resetEndingAtState = useResetRecoilState(endingAtState);
  const resetImageFileState = useResetRecoilState(imageFileState);
  const handleChange = useCallback(
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setProductInputState((values) => ({
        ...values,
        [prop]: event.target.value,
      }));
    },
    []
  );

  const setLocationErrorInfo = useCallback((isError: boolean) => {
    if (isError) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: createErrorObject(
          "????????? ???????????????. ????????? ???????????? ??????????????????."
        ),
      }));
    } else {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: noError,
      }));
    }
  }, []);

  useEffect(() => {
    if (initialProduct) {
      setProductInputState({
        name: initialProduct.name,
        phoneNumber: initialProduct.phoneNumber,
        price: String(initialProduct.price),
        tradingPlace: initialProduct.tradingPlace,
        content: initialProduct.content,
      });
      setLocationState(initialProduct.tradingPlace);
      setStatusState(initialProduct.status);

      const date = new Date(String(initialProduct.endingAt));
      setEndingAtState(
        dayjs(
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} 00:00:00`
        )
      );
    } else {
      resetProductInputState();
      resetEndingAtState();
      resetLocationState();
      resetStatusState();
    }
    resetImageFileState();
  }, [initialProduct]);
  return (
    <Form>
      <StatusSelection />
      <ImageUpload
        errorInfo={errorInfo.imageFile}
        imageUrl={
          initialProduct ? getImageUrl(initialProduct.image) : undefined
        }
      />
      <CustomInput
        label="??????? Product's Name"
        onChange={handleChange("name")}
        htmlFor="name"
        isPassword={false}
        errorInfo={errorInfo.name}
        defaultValue={initialProduct?.name}
      />
      <CustomInput
        label="???? Product's Explanation"
        onChange={handleChange("content")}
        htmlFor="content"
        isPassword={false}
        multiline={true}
        errorInfo={errorInfo.content}
        defaultValue={initialProduct?.content}
      />
      <PriceInput
        onChange={handleChange("price")}
        errorInfo={errorInfo.price}
        defaultValue={initialProduct ? String(initialProduct.price) : ""}
      />
      <CustomDatePicker />
      <CustomInput
        label="???? Your Phone Number"
        onChange={handleChange("phoneNumber")}
        htmlFor="phoneNumber"
        isPassword={false}
        errorInfo={errorInfo.phoneNumber}
        type="phone"
        helperText="'-'??? ?????????????????? (??????: 010-1234-5678)"
        defaultValue={initialProduct?.phoneNumber}
      />
      <div className="trading">
        <CustomInput
          label="???? Trading Place"
          htmlFor="search map"
          onChange={handleChange("tradingPlace")}
          isPassword={false}
          errorInfo={errorInfo.tradingPlace}
          icon={<SearchButton />}
          defaultValue={initialProduct?.tradingPlace}
        />
        <Map setLocationErrorInfo={setLocationErrorInfo} />
      </div>
      <SubmitButton initialProduct={initialProduct} />
    </Form>
  );
};

// ---------------------------------------------------

const SearchButton = () => {
  const setProductInputState = useSetRecoilState(productInputState);
  const setLocationState = useSetRecoilState(locationState);
  const changeLocation = useCallback(() => {
    setProductInputState((state) => {
      setLocationState(state.tradingPlace);
      return state;
    });
  }, []);
  return (
    <InputAdornment position="end">
      <IconButton aria-label="search icon" edge="end" onClick={changeLocation}>
        <BiSearchAlt />
      </IconButton>
    </InputAdornment>
  );
};

// ----------------------------------------------------

interface PriceInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  errorInfo: typeof noError;
  defaultValue?: string;
}

const PriceInput = ({ onChange, errorInfo, defaultValue }: PriceInputProps) => {
  const status = useRecoilValue(productStatusState);
  return status === "PROGRESS" ? (
    <CustomInput
      label="????Price"
      onChange={onChange}
      htmlFor="price"
      isPassword={false}
      errorInfo={errorInfo}
      defaultValue={defaultValue}
    />
  ) : null;
};

// ------------------------------------------------

const SubmitButton = ({ initialProduct }: Props) => {
  const [loading, setLoading] = useState(false);
  const setErrorInfo = useSetRecoilState(errorInfoState);
  const { name, content, tradingPlace, price, phoneNumber } =
    useRecoilValue(productInputState);
  const location = useRecoilValue(locationState);
  const status = useRecoilValue(productStatusState);
  const endingAt = useRecoilValue(endingAtState);
  const imageFile = useRecoilValue(imageFileState);
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageFile === null && !initialProduct?.image) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        imageFile: createErrorObject("????????? ?????????????????????"),
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
        name: createErrorObject("?????? ????????? ??????????????????"),
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
        content: createErrorObject("?????? ????????? ??????????????????"),
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
        phoneNumber: createErrorObject("??????????????? ??????????????????"),
      }));
      return;
    } else if (!/01[016789]-[^0][0-9]{3,4}-[0-9]{4}/.test(phoneNumber)) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        phoneNumber: createErrorObject("???????????? ????????? ?????? ??????????????????"),
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
        tradingPlace: createErrorObject("?????? ????????? ??????????????????."),
      }));
      return;
    } else if (tradingPlace !== location) {
      setErrorInfo((errorInfo) => ({
        ...errorInfo,
        tradingPlace: createErrorObject("?????? ?????? ????????? ????????? ???????????????."),
      }));
      return;
    }
    if (status === "PROGRESS") {
      if (price === "") {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("?????? ????????? ??????????????????"),
        }));
        return;
      } else if (Number.isNaN(Number(price))) {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("????????? ??????????????????"),
        }));
        return;
      } else if (Number(price) < 0) {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: createErrorObject("0 ????????? ????????? ???????????????."),
        }));
        return;
      } else {
        setErrorInfo((errorInfo) => ({
          ...errorInfo,
          price: noError,
        }));
      }
    }
    try {
      setLoading(true);
      if (initialProduct) {
        // ??????
        if (imageFile === null) {
          // ????????? ????????? ??????
          if (status === "AUCTION") {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: 0,
              endingAt,
              phoneNumber,
              tradingPlace,
              status,
              content,
            });
          } else {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: Number(price),
              endingAt: null,
              phoneNumber,
              tradingPlace,
              status,
              content,
            });
          }
        } else {
          // ????????? ?????? ??????
          await axios.delete(`/api/product/image/${initialProduct.image.id}`);
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append(
            "upload_preset",
            String(process.env.NEXT_PUBLIC_IMAGE_PRESET)
          );
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const imageData = await response.json();
          const { format, public_id: publicId, version } = imageData;
          const { data } = await axios.post("/api/product/image", {
            format,
            publicId,
            version: String(version),
          });
          if (status === "AUCTION") {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: 0,
              endingAt,
              phoneNumber,
              tradingPlace,
              imageId: data.image.id,
              status,
              content,
            });
          } else {
            await axios.patch(`/api/product/${initialProduct.id}`, {
              name,
              price: Number(price),
              endingAt: null,
              phoneNumber,
              tradingPlace,
              status,
              content,
              imageId: data.image.id,
            });
          }
        }
        setLoading(false);
        Router.push(
          `/sell/products/${initialProduct.id}?alert=???? ????????? ??????????????? ??????????????????.`,
          `/sell/products/${initialProduct.id}`
        );
      } else {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append(
          "upload_preset",
          String(process.env.NEXT_PUBLIC_IMAGE_PRESET)
        );
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const imageData = await response.json();
        const { format, public_id: publicId, version } = imageData;
        const { data } = await axios.post("/api/product/image", {
          format,
          publicId,
          version: String(version),
        });
        if (status === "AUCTION") {
          const { data: productData } = await axios.post("/api/product", {
            name,
            price: 0,
            endingAt,
            phoneNumber,
            tradingPlace,
            imageId: data.image.id,
            status,
            content,
          });
          const { success, product } = productData;
          if (success) {
            Router.push(
              `/sell/products/${product.id}?alert=???? ????????? ??????????????? ??????????????????.`,
              `/sell/products/${product.id}`
            );
          } else {
            setLoading(false);
            alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
          }
        } else {
          const { data: productData } = await axios.post("/api/product", {
            name,
            price: Number(price),
            endingAt: null,
            phoneNumber,
            tradingPlace,
            imageId: data.image.id,
            status,
            content,
          });
          const { success, product } = productData;
          if (success) {
            Router.push(
              `/sell/products/${product.id}?alert=???? ????????? ??????????????? ??????????????????.`,
              `/sell/products/${product.id}`
            );
          } else {
            setLoading(false);
            alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
          }
        }
      }
    } catch (e) {
      setLoading(false);
      alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
    }
  };
  return (
    <Button
      variant="contained"
      type="submit"
      disabled={loading}
      onClick={onSubmit}
    >
      {loading
        ? initialProduct
          ? "?????? ???..."
          : "?????? ???..."
        : initialProduct
        ? "????????????"
        : "????????????"}
    </Button>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  button[type="submit"] {
    max-width: 400px;
    margin: 0 auto;
  }
  p.warning {
    color: red;
  }
  #map {
    margin-top: 1rem;
  }
`;

export default ProductRegisterForm;
