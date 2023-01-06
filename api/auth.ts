import axios from "axios";
import {
  IdDuplicateRequest,
  IdDuplicateResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "types/auth";
import { BaseAPI } from "./base";

class AuthAPI extends BaseAPI {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  idDuplicate(userId: IdDuplicateRequest["userId"]) {
    return axios.get<IdDuplicateResponse>(
      `${this.baseUrl}/idDuplicate?userId=${userId}`
    );
  }
  register(payload: RegisterRequest) {
    return axios.post<RegisterResponse>(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginRequest) {
    return axios.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }
  logout() {
    return axios.post<LogoutResponse>(`${this.baseUrl}/logout`);
  }
}

export const authAPI = new AuthAPI("/api/auth");
