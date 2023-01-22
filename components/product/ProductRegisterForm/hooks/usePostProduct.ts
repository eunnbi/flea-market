import { ProductForm } from "@store/product/productFormState";
import { imageAPI } from "@api/image";
import { productAPI } from "@api/product";
import { useState } from "react";
import Router from "next/router";

export const usePostProduct = () => {
  const [loading, setLoading] = useState(false);
  const postProduct = async (state: ProductForm) => {
    try {
      setLoading(true);
      if (state.imageFile === null) throw Error();
      const { data } = await imageAPI.uploadImage(state.imageFile);
      const payload =
        state.status === "AUCTION"
          ? {
              name: state.name,
              content: state.content,
              tradingPlace: state.tradingPlace,
              phoneNumber: state.phoneNumber,
              status: state.status,
              price: 0,
              endingAt: new Date(String(state.endingAt)),
              imageId: data.imageId,
            }
          : {
              name: state.name,
              content: state.content,
              tradingPlace: state.tradingPlace,
              phoneNumber: state.phoneNumber,
              status: state.status,
              price: Number(state.price),
              endingAt: null,
              imageId: data.imageId,
            };
      const { data: productData } = await productAPI.createProduct(payload);
      const { success, productId } = productData;
      if (success) {
        Router.push(
          `/sell/products/${productId}?alert=🎉 상품을 성공적으로 등록했습니다.`,
          `/sell/products/${productId}`
        );
      } else {
        setLoading(false);
        alert("상품 등록에 실패하였습니다. 다시 시도해주세요. 😢");
      }
    } catch (e) {
      setLoading(false);
      alert("상품 등록에 실패하였습니다. 다시 시도해주세요. 😢");
    }
  };
  return { loading, postProduct };
};
