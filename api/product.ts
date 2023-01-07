import { deleteWish } from "@db/wishlist";
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
  getShoppingList({ absoluteUrl, token }: CommonParams) {
    this.setAuthorizationHeader(token);
    return axios.get<ShoppingListResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}/shopping`
    );
  }

  getProductDetails({ absoluteUrl, token }: CommonParams, id: Product["id"]) {
    this.setAuthorizationHeader(token);
    return axios.get<ProductDetailResponse>(
      `${this.getFullBaseUrl(absoluteUrl)}?id=${id}`
    );
  }

  createBidding(payload: BiddingCreateRequest) {
    return axios.post<BiddingCreateResponse>(
      `${this.baseUrl}/bidding`,
      payload
    );
  }

  createShopping(payload: ShoppingCreateRequest) {
    return axios.post<ShoppingCreateResponse>(
      `${this.baseUrl}/shopping`,
      payload
    );
  }

  updateWish(payload: WishUpdateRequest) {
    return axios.post<WishUpdateResponse>(`${this.baseUrl}/wishlist`, payload);
  }

  createRating(payload: RatingCreateRequest) {
    return axios.post<RatingCreateResponse>(`${this.baseUrl}/rating`, payload);
  }

  updateRating(payload: RatingUpdateRequest) {
    return axios.patch<RatingUpdateResponse>(`${this.baseUrl}/rating`, payload);
  }
}

export const productAPI = new ProductAPI("/api/product");
