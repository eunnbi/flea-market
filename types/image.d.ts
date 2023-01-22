import type { Image } from "@prisma/client";

declare interface ImageCreateRequest {
  public_id: string;
  format: string;
  version: number;
}

declare interface ImageCreateResponse extends SuccessResponse {
  imageId: Image["id"];
}

declare type ImageDeleteResponse = SuccessResponse;
