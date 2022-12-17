import { productDeleteState } from "@store/product/deleteState";
import { useRecoilState } from "recoil";
import axios from "axios";
import Router from "next/router";
import SimpleDialog from "@components/common/SimpleDialog";

const ProductDeleteDialog = () => {
  const [{ open, id }, setProductDeleteState] =
    useRecoilState(productDeleteState);
  const onDelete = async () => {
    try {
      await axios.delete(`/api/product/${id}`);
      Router.push(`/sell?alert=✂️ 상품이 정상적으로 삭제되었습니다`, "/sell");
    } catch (e) {
      alert("상품을 삭제할 수 없습니다. 다시 시도해주세요.");
    }
  };
  const handleClose = () =>
    setProductDeleteState((state) => ({ ...state, open: false }));
  return (
    <SimpleDialog
      open={open}
      handleClose={handleClose}
      onConfirm={onDelete}
      basicTitle="정말 삭제하시겠습니까?"
      loadingTitle="삭제 중..."
      content=""
    />
  );
};

export default ProductDeleteDialog;
