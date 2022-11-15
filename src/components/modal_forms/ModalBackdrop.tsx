import styled from "@emotion/styled";
import { motion } from "framer-motion";
import type { FC } from "react";

export const BaseModalStyled = styled(motion.div)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
`;

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

type ModalBackdropProps = {
  onClick?: () => void;
};

export const ModalBackdrop: FC<ModalBackdropProps> = ({ onClick }) => {
  return (
    <BaseModalStyled onClick={onClick} {...animation} />
  );
};