import { noError } from "@lib/createErrorObject";
import { Button } from "@mui/material";
import React, { useState, useCallback } from "react";
import CustomInput from "../../common/CustomInput";
import Map from "../../common/Map";
import CustomDatePicker from "./CustomDatePicker";
import ImageUpload from "./ImageUpload";
import styled from "@emotion/styled";
import axios from "axios";
import Router from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { errorInfoState } from "@store/product/errorInfoState";
import { locationState } from "@store/mapState";
import StatusSelection from "./StatusSelection";
import { ProductGetResponse } from "types/product";
import productFormState, {
  ProductForm,
  statusState,
} from "@store/product/productFormState";
import { useInitialize } from "./useInitialize";
import { useValidation } from "./useValidation";
import MapSearchButton from "./MapSearchButton";

type State = Pick<
  ProductForm,
  "name" | "phoneNumber" | "tradingPlace" | "status" | "content" | "price"
>;

interface Props {
  initialProduct: ProductGetResponse | null;
}

const ProductRegisterForm = ({ initialProduct }: Props) => {
  const errorInfo = useRecoilValue(errorInfoState);
  const setProductFormState = useSetRecoilState(productFormState);
  const handleChange = useCallback(
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setProductFormState((values) => ({
        ...values,
        [prop]: event.target.value,
      }));
    },
    []
  );

  useInitialize(initialProduct);
  return (
    <Form>
      <StatusSelection />
      <ImageUpload
        errorInfo={errorInfo.imageFile}
        imageUrl={initialProduct ? initialProduct.imageUrl : undefined}
      />
      <CustomInput
        label="🛍️ Product's Name"
        onChange={handleChange("name")}
        htmlFor="name"
        isPassword={false}
        errorInfo={errorInfo.name}
        defaultValue={initialProduct?.name}
      />
      <CustomInput
        label="📝 Product's Explanation"
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
        label="📞 Your Phone Number"
        onChange={handleChange("phoneNumber")}
        htmlFor="phoneNumber"
        isPassword={false}
        errorInfo={errorInfo.phoneNumber}
        type="phone"
        helperText="'-'를 포함해주세요 (예시: 010-1234-5678)"
        defaultValue={initialProduct?.phoneNumber}
      />
      <div className="trading">
        <CustomInput
          label="📌 Trading Place"
          htmlFor="search map"
          onChange={handleChange("tradingPlace")}
          isPassword={false}
          errorInfo={errorInfo.tradingPlace}
          icon={<MapSearchButton />}
          defaultValue={initialProduct?.tradingPlace}
        />
        <Map />
      </div>
      <SubmitButton initialProduct={initialProduct} />
    </Form>
  );
};

// ----------------------------------------------------

interface PriceInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  errorInfo: typeof noError;
  defaultValue?: string;
}

const PriceInput = ({ onChange, errorInfo, defaultValue }: PriceInputProps) => {
  const status = useRecoilValue(statusState);
  return status === "PROGRESS" ? (
    <CustomInput
      label="💲Price"
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
  const location = useRecoilValue(locationState);
  const {
    status,
    endingAt,
    imageFile,
    name,
    content,
    tradingPlace,
    price,
    phoneNumber,
  } = useRecoilValue(productFormState);
  const { validate } = useValidation();
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validate({
      location,
      status,
      imageFile,
      name,
      content,
      tradingPlace,
      price,
      phoneNumber,
      imageId: initialProduct?.imageId,
    });
    /*
    try {
      setLoading(true);
      if (initialProduct) {
        // 수정
        if (imageFile === null) {
          // 이미지 수정은 없음
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
          // 이미지 수정 있음
          await axios.delete(`/api/product/image/${initialProduct.imageId}`);
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
          `/sell/products/${initialProduct.id}?alert=🎉 상품을 성공적으로 수정했습니다.`,
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
              `/sell/products/${product.id}?alert=🎉 상품을 성공적으로 등록했습니다.`,
              `/sell/products/${product.id}`
            );
          } else {
            setLoading(false);
            alert("상품 등록에 실패하였습니다. 다시 등록해주세요.");
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
              `/sell/products/${product.id}?alert=🎉 상품을 성공적으로 등록했습니다.`,
              `/sell/products/${product.id}`
            );
          } else {
            setLoading(false);
            alert("상품 등록에 실패하였습니다. 다시 등록해주세요.");
          }
        }
      }
    } catch (e) {
      setLoading(false);
      alert("상품 등록에 실패하였습니다. 다시 등록해주세요.");
    }
    */
  };
  return (
    <Button variant="contained" type="submit" disabled={loading}>
      {loading
        ? initialProduct
          ? "수정 중..."
          : "등록 중..."
        : initialProduct
        ? "수정하기"
        : "등록하기"}
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
    background-color: black;
  }
  p.warning {
    color: red;
  }
  #map {
    margin-top: 1rem;
  }
`;

export default ProductRegisterForm;
