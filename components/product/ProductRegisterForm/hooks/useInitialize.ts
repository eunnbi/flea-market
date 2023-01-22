import { locationState, mapState } from "@store/mapState";
import productFormState from "@store/product/productFormState";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { ProductGetResponse } from "types/product";

export const useInitialize = (initialProduct: ProductGetResponse | null) => {
  const setProductFormState = useSetRecoilState(productFormState);
  const resetProductFormState = useResetRecoilState(productFormState);
  const resetMapState = useResetRecoilState(mapState);
  const setLocationState = useSetRecoilState(locationState);
  useEffect(() => {
    if (initialProduct) {
      const date = new Date(String(initialProduct.endingAt));
      setProductFormState({
        name: initialProduct.name,
        phoneNumber: initialProduct.phoneNumber,
        price: String(initialProduct.price),
        tradingPlace: initialProduct.tradingPlace,
        content: initialProduct.content,
        status: initialProduct.status,
        endingAt: dayjs(
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} 00:00:00`
        ),
        imageFile: null,
      });
      setLocationState(initialProduct.tradingPlace);
    } else {
      resetProductFormState();
      resetMapState();
    }
  }, [initialProduct]);
};
