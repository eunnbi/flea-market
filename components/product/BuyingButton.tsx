import { Button } from "@mui/material";
import axios from "axios";
import useModal from "hooks/useModal";
import BuyingDialog, { Props } from "./BuyingDialog";

const BuyingButton = ({
  token,
  id,
  sellerId,
  price,
}: { token: string | null } & Omit<Props, "handleClose">) => {
  const { openModal, closeModal } = useModal();
  const onClickBuyButton = () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      openModal(BuyingDialog, {
        id,
        price,
        sellerId,
        handleClose: closeModal,
      });
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };
  return (
    <Button variant="outlined" onClick={onClickBuyButton}>
      구매하기
    </Button>
  );
};

export default BuyingButton;
