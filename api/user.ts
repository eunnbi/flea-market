import { User } from "@prisma/client";
import axios from "axios";
import {
  SellersGetResponse,
  UserDeleteResponse,
  UserPatchResponse,
  UserPatchResquest,
  UsersGetResponse,
  UserVerifyResponse,
} from "types/user";
import { BaseAPI } from "./base";

class UserAPI extends BaseAPI {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getUsers(absoluteUrl?: string) {
    const url = absoluteUrl ? `${absoluteUrl}${this.baseUrl}` : this.baseUrl;
    return axios.get<UsersGetResponse>(url);
  }
  patchUser(id: User["id"], payload: UserPatchResquest) {
    return axios.patch<UserPatchResponse>(`${this.baseUrl}/${id}`, payload);
  }
  deleteUser(id: User["id"]) {
    return axios.delete<UserDeleteResponse>(`${this.baseUrl}/${id}`);
  }
  getSellers(absoluteUrl?: string) {
    return axios.get<SellersGetResponse>(
      `${absoluteUrl}${this.baseUrl}?role=SELLER`
    );
  }
  verify({
    absoluteUrl,
    token,
  }: {
    absoluteUrl: string;
    token: string | undefined;
  }) {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "Bearer";
    return axios.get<UserVerifyResponse>(
      `${absoluteUrl}${this.baseUrl}/verify`
    );
  }
}

export const userAPI = new UserAPI("/api/user");
