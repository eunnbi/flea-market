import { Status } from "@prisma/client";
import { BiddingItem } from "types/product";

export const getFinalPrice = ({
  status,
  bidding,
  price,
  maxPrice,
}: {
  status: Status;
  bidding?: BiddingItem[];
  price: number;
  maxPrice?: number;
}) => {
  if (status === "AUCTION_OFF") {
    return "입찰없음";
  } else if (status === "AUCTION") {
    return bidding && bidding.length
      ? `${bidding[0].price.toLocaleString()}원`
      : maxPrice
      ? `${maxPrice.toLocaleString()}원`
      : "입찰없음";
  } else {
    return `${price.toLocaleString()}원`;
  }
};
