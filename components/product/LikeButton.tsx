import { Tooltip } from "@mui/material";
import axios from "axios";
import Router from "next/router";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import styles from "@styles/ProductDetail.module.css";
import { productAPI } from "api/product";

interface Props {
  isLike?: boolean;
  token: string | null;
  id: string;
}

const LikeButton = ({ isLike, token, id }: Props) => {
  const onClickLikeButton = async () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (!isLike) {
        try {
          const { data } = await productAPI.updateWish({
            productId: id,
            wish: true,
          });
          const { success } = data;
          if (success) {
            Router.replace(
              `/products/${id}?alert=❤️ 위시리스트에 추가되었습니다.`,
              `/products/${id}`
            );
          } else {
            alert("⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (e) {
          alert("⚠️ 위시리스트 추가에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        try {
          const { data } = await productAPI.updateWish({
            productId: id,
            wish: false,
          });
          const { success } = data;
          if (success) {
            Router.replace(
              `/products/${id}?alert=🤍 위시리스트에서 삭제되었습니다.`,
              `/products/${id}`
            );
          } else {
            alert("⚠️ 위시리스트 삭제에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (e) {
          alert("⚠️ 위시리스트 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } else {
      alert("🔒 로그인이 필요합니다.");
    }
  };
  return (
    <Tooltip title="위시리스트" arrow>
      <button onClick={onClickLikeButton}>
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
