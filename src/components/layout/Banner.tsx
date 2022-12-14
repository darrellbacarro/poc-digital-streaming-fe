import styled from "@emotion/styled";
import actorsBg from '../../assets/images/actorsBg.svg';
import favoritesBg from '../../assets/images/favoritesBg.svg';
import genresBg from '../../assets/images/genresBg.svg';

const JUMBOTRON_BACKGROUNDS = {
  actor: actorsBg,
  genre: genresBg,
  favorite: favoritesBg,
};

type JumbotronProps = {
  bg: "actor" | "genre" | "favorite";
  height?: number;
};

export const Jumbotron = styled.div<JumbotronProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: ${(props) => props.height ?? 200}px;
  width: 100vw;
  background-color: orange;
  background-image: url(${(props) => JUMBOTRON_BACKGROUNDS[props.bg]});
  background-size: cover;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100vw;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    bottom: 0;
  }
`;