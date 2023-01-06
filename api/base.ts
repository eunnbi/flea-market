import axios from "axios";

export class BaseAPI {
  constructor(protected baseUrl: string) {}

  getFullBaseUrl(absoluteUrl: CommonParams["absoluteUrl"]) {
    return absoluteUrl ? `${absoluteUrl}${this.baseUrl}` : this.baseUrl;
  }
  setAuthorizationHeader(token: CommonParams["token"]) {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }
}
