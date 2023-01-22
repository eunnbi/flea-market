import { Image } from "@prisma/client";
import axios from "axios";
import type {
  ImageCreateRequest,
  ImageCreateResponse,
  ImageDeleteResponse,
} from "types/image";
import { BaseAPI } from "./base";

class ImageAPI extends BaseAPI {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      String(process.env.NEXT_PUBLIC_IMAGE_PRESET)
    );
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const imageData = (await response.json()) as ImageCreateRequest;
    const { format, public_id: publicId, version } = imageData;
    return axios.post<ImageCreateResponse>(this.baseUrl, {
      format,
      publicId,
      version: String(version),
    });
  }

  deleteImage(id: Image["id"]) {
    return axios.delete<ImageDeleteResponse>(`${this.baseUrl}/${id}`);
  }
}

export const imageAPI = new ImageAPI("/api/image");
