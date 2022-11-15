import styled from "@emotion/styled";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { RATING_STAR_SIZE, SIDEBAR_WIDTH } from "../../constants";
import { Movie } from "../../redux/models";
import { timeConvert } from "../../utils/helpers";
import FavoriteButton from "../input/FavoriteButton";
import { UIButton, UIButtonBar } from "../layout";

type FeaturedMovieStyledProps = {
  image: string;
};

export const FeaturedMovieStyled = styled(motion.div)<FeaturedMovieStyledProps>`
  position: absolute;
  top: 0;
  height: 70vh;
  width: 100vw;
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

export const FeaturedMovieDetails = styled.div`
  height: 60vh;
  min-height: 60vh;
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

type FeaturedMovieProps = {
  movie?: Movie;
  scrollTo?: () => void;
};

export const FeaturedMovie: FC<FeaturedMovieProps> = ({ movie, scrollTo }) => {
  const navigate = useNavigate();

  return (
    <>
      <FeaturedMovieStyled image={movie?.backdrop ?? ''} />
      <FeaturedMovieDetails>
        <h1>{movie?.title ?? ''}</h1>
        <div className="sub_details">
          <span>{movie?.release_year ?? ''}</span>&middot;
          <span>{timeConvert(movie?.runtime ?? 0)}</span>&middot;
          <Rating
            size={20}
            iconsCount={RATING_STAR_SIZE}
            initialValue={movie?.rating ?? 0}
            allowHover={false}
            disableFillHover={true}
          />
        </div>
        <p>{movie?.plot ?? ""}</p>
        <UIButtonBar>
          <FavoriteButton movieId={movie?.id!} />
          {
            scrollTo ? (
              <UIButton onClick={scrollTo}>
                <FontAwesomeIcon icon={solid("edit")} />
                <span>Write a Review</span>
              </UIButton>
            ) : (
              <UIButton onClick={() => navigate(`/browse/${movie?.id}`)}>
                <FontAwesomeIcon icon={solid("info-circle")} />
                <span>More Details</span>
              </UIButton>
            )
          }
        </UIButtonBar>
      </FeaturedMovieDetails>
    </>
  );
};