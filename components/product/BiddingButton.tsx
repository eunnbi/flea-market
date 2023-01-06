import { Button } from "@mui/material";
import axios from "axios";
import useModal from "hooks/useModal";
import BiddingDialog, { Props } from "./BiddingDialog";

const BiddingButton = ({
  token,
  id,
  maxPrice,
}: { token: string | null } & Omit<Props, "handleClose">) => {
  const { openModal, closeModal } = useModal();
  const onClickBidButton = () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      openModal(BiddingDialog, {
        id,
        maxPrice,
        handleClose: closeModal,
      });
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };
  return (
    <Button variant="outlined" onClick={onClickBidButton}>
      입찰하기
    </Button>
  );
};

export default BiddingButton;
