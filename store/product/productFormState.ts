import { atom, selector } from "recoil";
import dayjs, { Dayjs } from "dayjs";
import { Product } from "@prisma/client";

const today = new Date();

export type ProductForm = Pick<
  Product,
  "name" | "phoneNumber" | "content" | "tradingPlace" | "status"
> & {
  imageFile: File | null;
  price: string;
  endingAt: dayjs.Dayjs;
};

const productFormState = atom<ProductForm>({
  key: "proudctFormState",
  default: {
    status: "PROGRESS",
    imageFile: null,
    endingAt: dayjs(
      `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()} 00:00:00`
    ),
    name: "",
    phoneNumber: "",
    price: "",
    tradingPlace: "",
    content: "",
  },
});

export const imageFileState = selector({
  key: "imageFileState",
  get: ({ get }) => {
    const productForm = get(productFormState);
    return productForm.imageFile;
  },
  set: ({ get, set }, newValue) => {
    const productForm = get(productFormState);
    if (newValue instanceof File) {
      set(productFormState, { ...productForm, imageFile: newValue });
    }
  },
});

export const endingAtState = selector({
  key: "endingAtState",
  get: ({ get }) => {
    const productForm = get(productFormState);
    return productForm.endingAt;
  },
  set: ({ get, set }, newValue) => {
    const productForm = get(productFormState);
    const value = newValue as dayjs.Dayjs;
    set(productFormState, { ...productForm, endingAt: value });
  },
});

export const statusState = selector({
  key: "statusState",
  get: ({ get }) => {
    const productForm = get(productFormState);
    return productForm.status;
  },
  set: ({ get, set }, newValue) => {
    const productForm = get(productFormState);
    if (typeof newValue === "string") {
      set(productFormState, { ...productForm, status: newValue });
    }
  },
});

export const tradingPlaceState = selector({
  key: "tradingPlaceState",
  get: ({ get }) => {
    const productForm = get(productFormState);
    return productForm.tradingPlace;
  },
});

export default productFormState;
