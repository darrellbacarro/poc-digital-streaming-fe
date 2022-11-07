import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActorGrid } from "../components/actor_thumbnails/ActorGrid";
import FavoriteButton from "../components/input/FavoriteButton";
import { AnimatedContainer, FeaturedMovie, FeaturedMovieDetails, InfoCell, MainContent, OtherInfoGridStyled, UIButton, UIButtonBar } from "../components/layout";
import { Reviews } from "../components/reviews/Reviews";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { clearCurrentMovie, clearCurrentMovieReviews, loadMovieInfo, loadMovieReviews } from "../redux/slices";
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
      <FeaturedMovie image={currentMovie?.backdrop ?? ''} />
      <FeaturedMovieDetails>
        <h1>{currentMovie?.title ?? ''}</h1>
        <div className="sub_details">
          <span>{currentMovie?.release_year}</span>&middot;
          <span>{ timeConvert(currentMovie?.runtime ?? 0) }</span>&middot;
          <span>{ currentMovie?.rating ?? '-' } <FontAwesomeIcon icon={solid('star')} /></span>
        </div>
        <UIButtonBar>
          <FavoriteButton movieId={currentMovie?.id!} />
          <UIButton onClick={scrollToReviewForm}>
            <FontAwesomeIcon icon={solid('edit')} />
            <span>Write a Review</span>
          </UIButton>
        </UIButtonBar>
      </FeaturedMovieDetails>
      <MainContent>
        <h3>Overview</h3>
        <p>{ currentMovie?.plot ?? '' }</p>
        <h3>Cast</h3>
        <ActorGrid actors={currentMovie?.actors ?? []} />
        <h3>Other Information</h3>
        <OtherInfoGridStyled>
          <InfoCell title="Release Year" info={currentMovie?.release_year} />
          <InfoCell title="Budget" info={`\$${(currentMovie?.cost ?? 0).toLocaleString('en-us')}`} />
          <InfoCell title="Audience Rating" info="-" />
          <InfoCell
            title="Review Rating"
            info={
              <div>
                <FontAwesomeIcon icon={solid('star')} />
                <span>{currentMovie?.rating ?? '-'}</span>
              </div>
            }
          />
          <InfoCell title="Runtime" info={timeConvert(currentMovie?.runtime ?? 0)} />
        </OtherInfoGridStyled>
        <h3 style={{ color: 'orange' }}>Movie Reviews</h3>
        <Reviews setFormRef={setReviewForm} />
      </MainContent>
    </AnimatedContainer>
  );
};

export default MoviePage;
