import { Tooltip } from "@mui/material";
import styles from "@styles/ProductDetail.module.css";
import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { TbChevronUp, TbChevronDown } from "react-icons/tb";
import Map from "@components/common/Map";

const TradingPlaceMap = ({ tradingPlace }: { tradingPlace: string }) => {
  const [openMap, setOpenMap] = useState(false);
  return (
    <div className={styles.contentStart}>
      <FiMapPin />
      <div className={styles.grow}>
        <span className={styles.row}>
          {tradingPlace}
          <Tooltip title={openMap ? "지도 숨기기" : "지도 보기"} arrow>
            <button onClick={() => setOpenMap((state) => !state)}>
              {openMap ? <TbChevronUp /> : <TbChevronDown />}
            </button>
          </Tooltip>
        </span>
        {openMap && <Map />}
      </div>
    </div>
  );
};

export default TradingPlaceMap;
