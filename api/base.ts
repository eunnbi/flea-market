import axios from "axios";

export class BaseAPI {
  constructor(protected baseUrl: string) {}

  getFullBaseUrl(absoluteUrl: AbsoluteUrl) {
    return absoluteUrl ? `${absoluteUrl}${this.baseUrl}` : this.baseUrl;
  }
}
