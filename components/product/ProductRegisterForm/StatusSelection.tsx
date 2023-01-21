import { Chip } from "@mui/material";
import { statusState } from "@store/product/productFormState";
import { useRecoilState } from "recoil";

const StatusSelection = () => {
  const [status, setStatus] = useRecoilState(statusState);
  const toggleStatus = () => {
    setStatus((value) => (value === "AUCTION" ? "PROGRESS" : "AUCTION"));
  };
  return (
    <div className="flex gap-4">
      <Chip
        label="판매"
        variant={status === "PROGRESS" ? "filled" : "outlined"}
        onClick={toggleStatus}
        color="primary"
        className="filterChip"
      />
      <Chip
        label="경매"
        variant={status === "AUCTION" ? "filled" : "outlined"}
        onClick={toggleStatus}
        color="primary"
        className="filterChip"
      />
    </div>
  );
};

export default StatusSelection;
