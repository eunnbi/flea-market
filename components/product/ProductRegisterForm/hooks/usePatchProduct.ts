import { ProductForm } from "@store/product/productFormState";
import { imageAPI } from "api/image";
import { productAPI } from "api/product";
import Router from "next/router";
import { useState } from "react";

export const usePatchProduct = () => {
  const [loading, setLoading] = useState(false);
  const patchProduct = async (
    state: ProductForm & {
      imageId: string;
      id: string;
    }
  ) => {
    try {
      setLoading(true);
      let newImageId: string | undefined = undefined;
      if (state.imageFile) {
        await imageAPI.deleteImage(state.imageId);
        const { data } = await imageAPI.uploadImage(state.imageFile);
        newImageId = data.imageId;
      }
      const payload =
        state.status === "AUCTION"
          ? newImageId
            ? {
                name: state.name,
                content: state.content,
                tradingPlace: state.tradingPlace,
                phoneNumber: state.phoneNumber,
                status: state.status,
                price: 0,
                endingAt: new Date(String(state.endingAt)),
                imageId: newImageId,
              }
            : {
                name: state.name,
                content: state.content,
                tradingPlace: state.tradingPlace,
                phoneNumber: state.phoneNumber,
                status: state.status,
                price: 0,
                endingAt: new Date(String(state.endingAt)),
              }
          : newImageId
          ? {
              name: state.name,
              content: state.content,
              tradingPlace: state.tradingPlace,
              phoneNumber: state.phoneNumber,
              status: state.status,
              price: Number(state.price),
              endingAt: null,
              imageId: newImageId,
            }
          : {
              name: state.name,
              content: state.content,
              tradingPlace: state.tradingPlace,
              phoneNumber: state.phoneNumber,
              status: state.status,
              price: Number(state.price),
              endingAt: null,
            };
      const { data: productData } = await productAPI.updateProduct(
        state.id,
        payload
      );
      const { success, productId } = productData;
      if (success) {
        Router.push(
          `/sell/products/${productId}?alert=🎉 상품을 성공적으로 수정했습니다.`,
          `/sell/products/${productId}`
        );
      } else {
        setLoading(false);
        alert("상품 수정에 실패하였습니다. 다시 시도해주세요. 😢");
      }
    } catch (e) {
      setLoading(false);
      alert("상품 수정에 실패하였습니다. 다시 시도해주세요. 😢");
    }
  };
  return { loading, patchProduct };
};
