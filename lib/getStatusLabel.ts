import { Status } from "@prisma/client";

export const getStatusLabel = (status: Status) => {
  return status === "AUCTION"
    ? "경매"
    : status === "PROGRESS"
    ? "판매 진행중"
    : status === "PURCHASED"
    ? "판매 완료"
    : "경매 종료";
};
