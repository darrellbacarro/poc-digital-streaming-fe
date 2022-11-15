import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { ActorGrid } from "../components/actor_thumbnails/ActorGrid";
import {
  AnimatedContainer,
  InfoCell,
  MainContent,
  OtherInfoGridStyled
} from "../components/layout";
import { FeaturedMovie } from "../components/movie/FeaturedMovie";
import { Reviews } from "../components/reviews/Reviews";
import { RATING_STAR_SIZE } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import {
  clearCurrentMovie,
  clearCurrentMovieReviews,
  loadMovieInfo,
  loadMovieReviews
} from "../redux/slices";
import { timeConvert } from "../utils/helpers";

const MoviePage = () => {
  const { id } = useParams();
  const { currentMovie } = useAppSelector((state) => state.public);
  const dispatch = useAppDispatch();
  const [reviewForm, setReviewForm] = useState<HTMLFormElement | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(loadMovieInfo(id));
      dispatch(loadMovieReviews({ id, page: 1, limit: 15 }));
    }

    return () => {
      dispatch(clearCurrentMovie());
      dispatch(clearCurrentMovieReviews());
    };
  }, [id, dispatch]);

  const scrollToReviewForm = useCallback(() => {
    if (reviewForm) reviewForm.scrollIntoView({ behavior: "smooth" });
  }, [reviewForm]);

  return (
    <AnimatedContainer relative>
      <FeaturedMovie scrollTo={scrollToReviewForm} movie={currentMovie!} />
      <MainContent>
        <h3>Overview</h3>
        <p>{currentMovie?.plot ?? ""}</p>
        <h3>Cast</h3>
        <ActorGrid actors={currentMovie?.actors ?? []} />
        <h3>Other Information</h3>
        <OtherInfoGridStyled>
          <InfoCell title="Release Year" info={currentMovie?.release_year} />
          <InfoCell
            title="Budget"
            info={`$${(currentMovie?.cost ?? 0).toLocaleString("en-us")}`}
          />
          <InfoCell title="Audience Rating" info="-" />
          <InfoCell
            title="Review Rating"
            info={
              <Rating
                size={20}
                iconsCount={RATING_STAR_SIZE}
                initialValue={currentMovie?.rating ?? 0}
                allowHover={false}
                disableFillHover={true}
              />
            }
          />
          <InfoCell
            title="Runtime"
            info={timeConvert(currentMovie?.runtime ?? 0)}
          />
        </OtherInfoGridStyled>
        <h3 style={{ color: "orange" }}>Movie Reviews</h3>
        <Reviews setFormRef={setReviewForm} />
      </MainContent>
    </AnimatedContainer>
  );
};

export default MoviePage;
