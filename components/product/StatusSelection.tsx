import styled from "@emotion/styled";
import { Chip } from "@mui/material";
import { statusState } from "@store/product/statusState";
import { useRecoilState } from "recoil";

const StatusSelection = () => {
  const [status, setStatus] = useRecoilState(statusState);
  const toggleStatus = () => {
    setStatus((value) => (value === "AUCTION" ? "PROGRESS" : "AUCTION"));
  };
  return (
    <Box>
      <Chip
        label="판매"
        variant={status === "PROGRESS" ? "filled" : "outlined"}
        onClick={toggleStatus}
        color="primary"
      />
      <Chip
        label="경매"
        variant={status === "AUCTION" ? "filled" : "outlined"}
        onClick={toggleStatus}
        color="primary"
      />
    </Box>
  );
};

const Box = styled.div`
  display: flex;
  gap: 1rem;
  span {
    font-size: 0.9rem;
  }
`;

export default StatusSelection;
