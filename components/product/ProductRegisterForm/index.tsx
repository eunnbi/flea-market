import { noError } from "@lib/createErrorObject";
import { Button } from "@mui/material";
import React, { useCallback } from "react";
import CustomInput from "../../common/CustomInput";
import Map from "../../common/Map";
import CustomDatePicker from "./CustomDatePicker";
import ImageUpload from "./ImageUpload";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { errorInfoState } from "@store/product/errorInfoState";
import { locationState } from "@store/mapState";
import StatusSelection from "./StatusSelection";
import { ProductGetResponse } from "types/product";
import productFormState, {
  ProductForm,
  statusState,
} from "@store/product/productFormState";
import { useInitialize } from "./hooks/useInitialize";
import { useValidation } from "./hooks/useValidation";
import MapSearchButton from "./MapSearchButton";
import { usePostProduct } from "./hooks/usePostProduct";
import { usePatchProduct } from "./hooks/usePatchProduct";

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
    <form className="flex flex-col gap-8">
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
    </form>
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
  const location = useRecoilValue(locationState);
  const productForm = useRecoilValue(productFormState);
  const { validate } = useValidation();
  const { loading: postLoading, postProduct } = usePostProduct();
  const { loading: patchLoading, patchProduct } = usePatchProduct();
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !validate({
        ...productForm,
        location,
        imageId: initialProduct?.imageId,
      })
    )
      return;

    if (initialProduct) {
      await patchProduct({
        ...productForm,
        id: initialProduct.id,
        imageId: initialProduct.imageId,
      });
    } else {
      await postProduct(productForm);
    }
  };
  return (
    <Button
      variant="contained"
      type="submit"
      className="bg-black my-0 mx-auto max-w-sm"
      onClick={onSubmit}
      disabled={postLoading || patchLoading}
    >
      {patchLoading
        ? "수정 중..."
        : postLoading
        ? "등록 중..."
        : initialProduct
        ? "수정하기"
        : "등록하기"}
    </Button>
  );
};

export default ProductRegisterForm;
