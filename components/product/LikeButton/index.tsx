import { Tooltip } from "@mui/material";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import styles from "@styles/ProductDetail.module.css";
import { useLike } from "./useLike";

interface Props {
  isLike?: boolean;
  id: string;
}

const LikeButton = ({ isLike, id }: Props) => {
  const onClick = useLike({ isLike, productId: id });
  return (
    <Tooltip title="위시리스트" arrow>
      <button onClick={onClick}>
        {isLike ? (
          <IoMdHeart className={styles.heartIcon} />
        ) : (
          <IoMdHeartEmpty className={styles.heartIcon} />
        )}
      </button>
    </Tooltip>
  );
};

export default LikeButton;
