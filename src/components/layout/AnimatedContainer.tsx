import styled from "@emotion/styled";
import { motion, MotionStyle } from "framer-motion";
import { FC, forwardRef, ReactNode, UIEvent, useCallback } from 'react';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "../../constants";
import { usePublicLayoutContext } from "../ui/PublicLayout";

export const AnimatedDiv = styled(motion.div)`
  padding-top: ${HEADER_HEIGHT + 24}px;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export enum PageTransition {
  SLIDEFADE = "SLIDEFADE",
  FADEIN = "FADEIN",
}

type AnimatedContainerProps = {
  children: ReactNode | ((props: { ref: any }) => ReactNode);
  style?: MotionStyle;
  relative?: boolean;
  transition?: PageTransition;
  layoutId?: string;
};

const transitions = {
  [PageTransition.SLIDEFADE]: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { ease: 'easeInOut', duration: 0.4 },
  },
  [PageTransition.FADEIN]: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { ease: 'easeInOut' },
  },
}; 

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(({
  style,
  children,
  relative,
  transition = PageTransition.SLIDEFADE,
  layoutId,
}, ref) => {
  const { setScrolled } = usePublicLayoutContext();
  
  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [setScrolled]);

  return (
    <AnimatedDiv  
      ref={ref}
      layoutId={layoutId}
      onScroll={handleScroll}
      style={{
        ...(style ?? {}),
        position: relative ? "relative" : "initial",
      }} 
      {...transitions[transition]}
    >
      {
        typeof children === 'function' ? children({ ref }) : children
      }
    </AnimatedDiv>
  );
});

type FeaturedMovieProps = {
  image: string;
};

export const FeaturedMovie = styled.div<FeaturedMovieProps>`
  position: absolute;
  top: 0;
  left: ${SIDEBAR_WIDTH}px;
  height: 65vh;
  width: calc(100vw - ${SIDEBAR_WIDTH}px);
  background-image: url(${(props) => props.image});
  background-size: cover;

  &::after {
    content: '';
    position: absolute;
    height: 300px;
    width: 100vw;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    bottom: 0;
  }
`;

export const UIButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const FeaturedMovieDetails = styled.div`
  height: 55vh;
  min-height: 55vh;
  width: 45vw;
  margin-left: ${SIDEBAR_WIDTH}px;
  z-index: 8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 36px;
  padding-bottom: 48px;

  & > *:not(div.sub_details) {
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }

  & > h1 {
    margin-bottom: 2px;
  }

  & div.sub_details {
    font-size: 16px;
    display: flex;
    opacity: 0.8;
    gap: 8px;
    margin-top: 4px;

    & + ${UIButtonBar} {
      margin-top: 16px;
    }
  }
`;

export const UIButton = styled(motion.button)`
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #0f0f0f;
  color: #fff;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
  align-self: flex-start;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  transition: background-color 300ms;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;

  &.no-border {
    border-color: transparent;
  }

  &.single {
    margin-left: 16px;
    width: calc(100% - 32px);
  }

  &.no-margin {
    margin-left: 0;
    width: 100%;
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    background-color: #5f5f5f;
    outline: none;
  }

  &.accent {
    background-color: #1187d0;

    &:hover, &:focus, &:active {
      background-color: #49a5de;
    }
  }
`;

export const OtherInfoGridStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;

  & h4 {
    margin-bottom: 6px;
  }

  & .info_cell div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
`;

export const MainContent = styled(motion.div)`
  z-index: 8;
  margin-left: ${SIDEBAR_WIDTH}px;
  padding: 0 36px;
  display: flex;
  flex-direction: column;
  padding-bottom: 36px;

  & > h3 {
    margin-bottom: 8px;
  }

  & p {
    line-height: 26px;
  }
`;

type InfoCellProps = {
  title: string;
  info: string | ReactNode;
};

export const InfoCell: FC<InfoCellProps> = ({ title, info }) => {
  return (
    <div className="info_cell">
      <h4>{ title }</h4>
      { typeof info === 'string' ? <p>{ info }</p> : info }
    </div>
  );
};