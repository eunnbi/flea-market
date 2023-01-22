import React, { createContext, useEffect, useState } from "react";

export const toastMessageContext = createContext({
  show: false,
  message: "",
});

interface Props {
  state?: {
    show: boolean;
    message: string;
  };
}

const ToastMessageProvider = (props: React.PropsWithChildren<Props>) => {
  const [state, setState] = useState({
    show: false,
    message: "",
  });
  const { show } = state;
  const onClose = () => {
    setState((state) => ({ ...state, show: false }));
  };
  useEffect(() => {
    setState(
      props.state
        ? props.state
        : {
            show: false,
            message: "",
          }
    );
  }, [props.state]);
  useEffect(() => {
    if (show) {
      setTimeout(onClose, 2000);
    }
  }, [show]);
  return (
    <toastMessageContext.Provider value={state}>
      {props.children}
    </toastMessageContext.Provider>
  );
};

export default ToastMessageProvider;
