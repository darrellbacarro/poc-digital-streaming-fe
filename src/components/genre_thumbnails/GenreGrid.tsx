import styled from "@emotion/styled";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Genre } from "../../redux/models";

export const GenreGridStyled = styled.div`
  display: grid;
  align-self: stretch;
  grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  column-gap: 16px;
  row-gap: 16px;
`;

export const GenreItemStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  border-radius: 5px;
  min-height: 150px;
  background-color: gray;
  transition: all 500ms;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    transform: scale(1.15);
    box-shadow: 0 0 15px 1px rgba(255, 255, 255, 0.3);
    z-index: 8;
  }

  & > h3 {
    margin: 0;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
`;

type GenreItemProps = {
  genre: string;
  gradient: "red-salvation"
    | "aqua-splash"
    | "spiky-naga"
    | "premium-dark"
    | "jungle-day";
  genreId?: string;
};

export const GenreItem: FC<GenreItemProps> = ({ genre, gradient, genreId }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (genreId) navigate(genreId);
  }, [genreId, navigate]);

  return (
    <GenreItemStyled onClick={handleClick} className={gradient}>
      <h3>{ genre }</h3>
    </GenreItemStyled>
  );
};

type GenreGridProps = {
  genres: Partial<Genre>[];
};

export const GenreGrid: FC<GenreGridProps> = ({ genres = [] }) => {
  return (
    <GenreGridStyled>
      {
        genres.map((genre) => (
          <GenreItem key={genre.id} genreId={genre.id} genre={genre.title ?? ''} gradient={genre.gradient as any} />
        ))
      }
    </GenreGridStyled>
  );
};