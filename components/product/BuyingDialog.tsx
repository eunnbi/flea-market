import SimpleDialog from "@components/common/SimpleDialog";
import { buyingState } from "@store/product/buyingState";
import axios from "axios";
import { useRecoilState } from "recoil";
import Router from "next/router";

const BuyingDialog = () => {
  const [{ open, price, sellerId, id, token }, setBuyingState] =
    useRecoilState(buyingState);
  const handleClose = () =>
    setBuyingState((state) => ({ ...state, open: false }));
  const onConfirmBuying = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const { data } = await axios.post("/api/product/buy", {
        price,
        sellerId,
        productId: id,
      });
      const { success } = data;
      if (success) {
        Router.replace(
          `/products/${id}?alert=π κ΅¬λ§€ μλ£λμμ΅λλ€! μΌν λ¦¬μ€νΈλ₯Ό νμΈν΄λ³΄μΈμ!`,
          `/products/${id}`
        );
      } else {
        alert("β οΈ μν κ΅¬μμ μ€ν¨νμ΅λλ€. λ€μ μλν΄μ£ΌμΈμ.");
      }
    } catch (e) {
      alert("β οΈ μν κ΅¬μμ μ€ν¨νμ΅λλ€. λ€μ μλν΄μ£ΌμΈμ.");
    }
  };
  return (
    <SimpleDialog
      open={open}
      handleClose={handleClose}
      onConfirm={onConfirmBuying}
      basicTitle="μ λ§ κ΅¬λ§€νμκ² μ΅λκΉ?"
      loadingTitle="μ²λ¦¬μ€..."
      content=""
    />
  );
};

export default BuyingDialog;
