import { Chip } from "@mui/material";
import { statusFilterState } from "@store/statusFilterState";
import React from "react";
import { useRecoilState } from "recoil";

const StatusFilter = () => {
  const [filter, setFilter] = useRecoilState(statusFilterState);
  return (
    <div className="flex items-center gap-4">
      <Chip
        label="경매"
        onClick={() =>
          setFilter((filter) => ({ ...filter, AUCTION: !filter.AUCTION }))
        }
        variant={filter.AUCTION ? "filled" : "outlined"}
        className="filterChip"
      />
      <Chip
        label="판매 진행 중"
        onClick={() =>
          setFilter((filter) => ({ ...filter, PROGRESS: !filter.PROGRESS }))
        }
        variant={filter.PROGRESS ? "filled" : "outlined"}
        className="filterChip"
      />
      <Chip
        label="판매 완료"
        onClick={() =>
          setFilter((filter) => ({ ...filter, PURCHASED: !filter.PURCHASED }))
        }
        variant={filter.PURCHASED ? "filled" : "outlined"}
        className="filterChip"
      />
    </div>
  );
};

export default React.memo(StatusFilter);
