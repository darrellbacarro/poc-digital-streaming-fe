import styled from "@emotion/styled";
import { FC, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ThumbnailItemProps = {
  image: string;
  pathId?: string;
};

export const ThumbnailItemStyled = styled.div<ThumbnailItemProps>`
  position: relative;
  display: block;
  flex: 1 1 0px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-width: 256px;
  max-width: 256px;
  height: 144px;
  border-radius: 3px;
  scroll-snap-align: center;
  transition: transform 500ms, opacity 300ms, box-shadow 500ms;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 15px 1px rgba(255, 255, 255, 0.5);
    border: 1px rgba(255, 255, 255, 0.8) solid;
  }

  &:first-of-type {
    transform-origin: left;
  }
`;

export const ThumbnailItem: FC<
  ThumbnailItemProps & { children: ReactNode }
> = ({ children, image, pathId }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    if (pathId) navigate(`/browse/${pathId}`);
  }, [navigate, pathId]);

  return (
    <ThumbnailItemStyled onClick={handleNavigate} image={image}>
      {children}
    </ThumbnailItemStyled>
  );
};
