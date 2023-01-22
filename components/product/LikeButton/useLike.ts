import { productAPI } from "@api/product";
import { useToken } from "@hooks/useToken";
import Router from "next/router";

export const useLike = ({
  isLike,
  productId,
}: {
  isLike?: boolean;
  productId: string;
}) => {
  const token = useToken();
  const onClick = async () => {
    if (token) {
      let wish = true;
      let alertMessage = "❤️ 위시리스트에 추가되었습니다.";
      if (isLike) {
        wish = false;
        alertMessage = "🤍 위시리스트에서 삭제되었습니다.";
      }
      try {
        const { data } = await productAPI.updateWish({
          productId,
          wish,
        });
        const { success } = data;
        if (success) {
          Router.replace(
            `/products/${productId}?alert=${alertMessage}`,
            `/products/${productId}`
          );
        } else {
          alert("⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (e) {
        alert("⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };
  return onClick;
};
