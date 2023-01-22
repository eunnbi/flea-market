import { toastMessageContext } from "@context/ToastMessageProvider";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useContext } from "react";

const ToastMessage = () => {
  const { show, message } = useContext(toastMessageContext);
  return (
    <div
      className={
        show
          ? "flex items-center gap-4 fixed top-36 right-1/2 z-20 translate-x-2/4 bg-black text-white rounded-md p-4 shadow-lg"
          : "hidden"
      }
    >
      <IoMdCheckmarkCircleOutline className="text-2xl" />
      {message}
    </div>
  );
};

export default ToastMessage;
