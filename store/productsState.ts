import { Product } from "@prisma/client";
import { atom } from "recoil";

export const productsState = atom<{
    initialProducts: ProductItem[];
    products: ProductItem[]
}>({
    key: "productsState",
    default: {
        initialProducts: [],
        products: []
    }
})