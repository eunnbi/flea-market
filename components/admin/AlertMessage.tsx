import { Alert } from "@mui/material";
import { alertMessageState } from "@store/admin/alertMessageState";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const AlertMessage = () => {
  const [message, setMessage] = useRecoilState(alertMessageState);
  useEffect(() => {
    if (message === "") return;
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }, [message]);
  return message ? (
    <Alert severity="success" className="flex items-center">
      {message}
    </Alert>
  ) : null;
};

export default AlertMessage;
