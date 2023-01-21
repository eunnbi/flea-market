import { Product } from "@prisma/client";
import axios from "axios";
import {
  ProductsGetResponse,
  ProductItem,
  WishListGetResponse,
  ProductDetailResponse,
  BiddingCreateRequest,
  BiddingCreateResponse,
  ShoppingCreateRequest,
  ShoppingCreateResponse,
  WishUpdateRequest,
  WishUpdateResponse,
  ShoppingListResponse,
  RatingCreateRequest,
  RatingCreateResponse,
  RatingUpdateRequest,
  RatingUpdateResponse,
  ProductGetResponse,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
  ProductDeleteResponse,
} from "types/product";
import { BaseAPI } from "./base";

class ProductAPI extends BaseAPI {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  createProduct(payload: ProductCreateRequest) {
    return axios.post<ProductCreateResponse>(this.baseUrl, payload);
  }
  updateProduct(id: Product["id"], payload: ProductUpdateRequest) {
    return axios.patch<ProductUpdateResponse>(`${this.baseUrl}/${id}`, payload);
  }
  deleteProduct(id: Product["id"]) {
    return axios.delete<ProductDeleteResponse>(`${this.baseUrl}/${id}`);
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
  getProductById(absoluteUrl: CommonParams["absoluteUrl"], id: Product["id"]) {
    return axios.get<ProductGetResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}?id=${id}`
    );
  }
  getProductDetails({ absoluteUrl, token }: CommonParams, id: Product["id"]) {
    this.setAuthorizationHeader(token);
    return axios.get<ProductDetailResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}/detail?id=${id}`
    );
  }

  getWishList({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<WishListGetResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}/wishlist`
    );
  }
  updateWish(payload: WishUpdateRequest) {
    return axios.post<WishUpdateResponse>(`${this.baseUrl}/wishlist`, payload);
  }

  getShoppingList({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<ShoppingListResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}/shopping`
    );
  }
  createShopping(payload: ShoppingCreateRequest) {
    return axios.post<ShoppingCreateResponse>(
      `${this.baseUrl}/shopping`,
      payload
    );
  }

  createBidding(payload: BiddingCreateRequest) {
    return axios.post<BiddingCreateResponse>(
      `${this.baseUrl}/bidding`,
      payload
    );
  }

  createRating(payload: RatingCreateRequest) {
    return axios.post<RatingCreateResponse>(`${this.baseUrl}/rating`, payload);
  }
  updateRating(payload: RatingUpdateRequest) {
    return axios.patch<RatingUpdateResponse>(`${this.baseUrl}/rating`, payload);
  }
}

export const productAPI = new ProductAPI("/api/product");
