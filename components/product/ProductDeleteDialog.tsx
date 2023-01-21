import Router from "next/router";
import SimpleDialog from "@components/common/SimpleDialog";
import { productAPI } from "api/product";

interface Props {
  id: string;
  handleClose: () => void;
}

const ProductDeleteDialog = ({ id, handleClose }: Props) => {
  const onDelete = async () => {
    try {
      await productAPI.deleteProduct(id);
      Router.push(`/sell?alert=✂️ 상품이 정상적으로 삭제되었습니다`, "/sell");
    } catch (e) {
      alert("상품을 삭제할 수 없습니다. 다시 시도해주세요.");
    }
  };
  return (
    <SimpleDialog
      open={true}
      handleClose={handleClose}
      onConfirm={onDelete}
      basicTitle="정말 삭제하시겠습니까?"
      loadingTitle="삭제 중..."
      content=""
    />
  );
};

export default ProductDeleteDialog;
