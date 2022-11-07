import styled from "@emotion/styled";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Children, FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { SIDEBAR_WIDTH } from "../../constants";
import { useHover } from "../../hooks/hover.hook";
import { ScrollDirection, useScroll } from "../../hooks/scroll.hook";
import { ThumbnailDetails } from "./ThumbnailDetails";
import { ThumbnailItemStyled } from "./ThumbnailItem";

type ThumbnailRowStyledProps = {
  rowTitle?: string;
  paddingLeft?: number;
};

type ThumbnailRowComponentProps = {
  children: ReactNode;
}

type ThumbnailRowProps = ThumbnailRowStyledProps & ThumbnailRowComponentProps;

export const ThumbnailRowStyled = styled.div<ThumbnailRowStyledProps>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-height: 220px;
  height: 220px;
  gap: 2px;
  max-width: 100vw;
  min-width: 100vw;
  /* overflow-x: scroll;
  scroll-snap-type: x mandatory; */
  overflow: hidden;
  padding-bottom: 30px;
  padding-left: ${(props) => (props.paddingLeft ?? 0) + 32}px;
  padding-right: 82px;

  &::-webkit-scrollbar {
    display: none;
  }

  /* &:focus-within ${ThumbnailItemStyled},
  &:hover ${ThumbnailItemStyled} {
    transform: translateX(-12.5%);
  } */
  &.hovered {
    overflow-x: hidden;
    & ${ThumbnailItemStyled} {
      transform: translateX(-12.5%);
    }
  }

  & ${ThumbnailItemStyled}:hover {
    transform: scale(1.25);
    z-index: 5;

    & ${ThumbnailDetails} {
      transform: translateY(0);

      & > * {
        transform: scale(0.8);
      }

      & > div {
        margin: -20px;

        & > h3 {
          max-width: none;
          width: 115%;
        }
      }
    }
  }

  & ${ThumbnailItemStyled}:focus ~ ${ThumbnailItemStyled},
  & ${ThumbnailItemStyled}:hover ~ ${ThumbnailItemStyled} {
    transform: translateX(12.5%);
  }

  & ${ThumbnailItemStyled}:first-of-type:focus ~ ${ThumbnailItemStyled},
  & ${ThumbnailItemStyled}:first-of-type:hover ~ ${ThumbnailItemStyled} {
    transform: translateX(25%);
  }
`;

export const ThumbnailArrowStyled = styled.button`
  position: absolute;
  height: 144px;
  background-color: transparent;
  width: 82px;
  border: 0;
  z-index: 12;
  top: 45px;
  color: white;
  opacity: 0;

  &, & > svg {
    transition: all 500ms;
  }

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.8);

    & > svg {
      transform: scale(1.5);
    }
  }
`;
enum ArrowDirection {
  left = "left",
  right = "right",
}
type ThumbnailArrowProps = {
  direction: ArrowDirection;
  onClick: () => void;
};

export const ThumbnailArrow: FC<ThumbnailArrowProps> = ({
  direction,
  onClick,
}) => {
  const icon = useMemo(() => {
    return direction === ArrowDirection.left
      ? solid('chevron-left')
      : solid('chevron-right');
  }, [direction]);
  return (
    <ThumbnailArrowStyled className={direction} onClick={onClick}>
      <FontAwesomeIcon size="2x" icon={icon} />
    </ThumbnailArrowStyled>
  );
};

export const ThumbnailRowWrapper = styled.div<ThumbnailRowProps>`
  position: relative;
  width: 100%;
  min-height: 220px;
  height: 220px;
  overflow: hidden;
  margin-top: ${(props) => (props.rowTitle ? 0 : "-16px")};

  & ${ThumbnailArrowStyled}.left {
    left: ${SIDEBAR_WIDTH}px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  & ${ThumbnailArrowStyled}.right {
    right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  &:hover ${ThumbnailArrowStyled} {
    opacity: 1;
  }

  &::before {
    content: ${(props) => (props.rowTitle ? `"${props.rowTitle}"` : "")};
    position: absolute;
    top: 4px;
    left: ${(props) => (props.paddingLeft ?? 0) + 32}px;
    font-size: 22px;
    font-weight: 600;
    color: white;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.9);
    min-width: 400px;
    z-index: 5;
  }
`;

export const ThumbnailRow: FC<ThumbnailRowProps> = ({ children, rowTitle, paddingLeft }) => {
  const [hoverRef, el] = useHover<HTMLDivElement>();
  const [scrollRef, [scroll, scrollWidth, offsetWidth]] = useScroll<HTMLDivElement>(ScrollDirection.Horizontal);

  const hovered = useMemo(() => {
    if (el) {
      const targetClasses = [].slice.apply(el.classList);
      return targetClasses.every((c: string) => !c.includes('ThumbnailRowStyled'));
    }

    return false;
  }, [el]);

  const showLeftArrow = useMemo(() => {
    return scroll > 0;
  }, [scroll]);

  const showRightArrow = useMemo(() => {
    return scrollWidth - offsetWidth > scroll && Children.count(children) > 4;
  }, [scroll, scrollWidth, offsetWidth, children]);

  const handleArrowClick = useCallback((direction: ArrowDirection) => {
    const itemWidth = 257;
    const itemsToScroll = 4;
    const scrollWidth = itemWidth * itemsToScroll;
    if (scrollRef.current) {
      if (direction === ArrowDirection.left) {
        scrollRef.current.scroll({
          left: scroll - scrollWidth,
          behavior: 'smooth',
        })
      } else {
        scrollRef.current.scroll({
          left: scroll + scrollWidth,
          behavior: 'smooth',
        })
      }
    }
  }, [scroll, scrollRef]);

  useEffect(() => {
    scrollRef?.current.dispatchEvent(new CustomEvent('scroll'));
  }, [scrollRef]);

  return (
    <ThumbnailRowWrapper rowTitle={rowTitle} paddingLeft={paddingLeft}>
      { showLeftArrow
        && <ThumbnailArrow
            direction={ArrowDirection.left}
            onClick={() => handleArrowClick(ArrowDirection.left)} /> }
      <ThumbnailRowStyled
        className={clsx({ hovered })}
        ref={(el) => {
          if (el) {
            hoverRef.current = el;
            scrollRef.current = el;
          }
        }}
        paddingLeft={paddingLeft}>
        { children }
      </ThumbnailRowStyled>
      { showRightArrow
        && <ThumbnailArrow
            direction={ArrowDirection.right}
            onClick={() => handleArrowClick(ArrowDirection.right)} /> }
    </ThumbnailRowWrapper>
  );
};