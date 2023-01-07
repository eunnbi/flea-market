import SimpleDialog from "@components/common/SimpleDialog";
import { productAPI } from "api/product";
import axios from "axios";
import Router from "next/router";

export interface Props {
  id: string;
  price: number;
  sellerId: string;
  handleClose: () => void;
}

const BuyingDialog = ({ id, handleClose }: Props) => {
  const onConfirmBuying = async () => {
    try {
      const { data } = await productAPI.createShopping({
        productId: id,
      });
      const { success } = data;
      if (success) {
        Router.replace(
          `/products/${id}?alert=🎉 구매 완료되었습니다! 쇼핑 리스트를 확인해보세요!`,
          `/products/${id}`
        );
      } else {
        alert("⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      alert("⚠️ 상품 구입에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <SimpleDialog
      open={true}
      handleClose={handleClose}
      onConfirm={onConfirmBuying}
      basicTitle="정말 구매하시겠습니까?"
      loadingTitle="처리중..."
      content=""
    />
  );
};

export default BuyingDialog;
