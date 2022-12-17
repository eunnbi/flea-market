import SimpleDialog from "@components/common/SimpleDialog";
import { buyingState } from "@store/product/buyingState";
import axios from "axios";
import { useRecoilState } from "recoil";
import Router from "next/router";

const BuyingDialog = () => {
  const [{ open, price, sellerId, id, token }, setBuyingState] =
    useRecoilState(buyingState);
  const handleClose = () =>
    setBuyingState((state) => ({ ...state, open: false }));
  const onConfirmBuying = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const { data } = await axios.post("/api/product/buy", {
        price,
        sellerId,
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
      open={open}
      handleClose={handleClose}
      onConfirm={onConfirmBuying}
      basicTitle="정말 구매하시겠습니까?"
      loadingTitle="처리중..."
      content=""
    />
  );
};

export default BuyingDialog;
