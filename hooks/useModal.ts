import { modalState } from "@store/modalState";
import { useSetRecoilState } from "recoil";

export default function useModal() {
  const setModalState = useSetRecoilState(modalState);
  const closeModal = () => {
    setModalState({
      Component: null,
      props: {},
    });
  };

  const openModal = <T extends object>(
    Component: (props: T) => JSX.Element,
    props: T
  ) => {
    setModalState({
      Component,
      props,
    });
  };
  return {
    openModal,
    closeModal,
  };
}
