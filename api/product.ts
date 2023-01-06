import axios from "axios";
import {
  ProductsGetResponse,
  ProductItem,
  WishListGetResponse,
} from "types/product";
import { BaseAPI } from "./base";

class ProductAPI extends BaseAPI {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  getProducts({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<ProductsGetResponse>(this.getFullBaseUrl(absoluteUrl));
  }
  getSellerProducts({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<ProductsGetResponse>(this.getFullBaseUrl(absoluteUrl));
  }
  getProductsByName(token: CommonParams["token"], name: ProductItem["name"]) {
    this.setAuthorizationHeader(token);
    return axios.get<ProductsGetResponse>(`${this.baseUrl}?name=${name}`);
  }
  getWishList({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<WishListGetResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}/wishlist`
    );
  }
}

export const productAPI = new ProductAPI("/api/product");
