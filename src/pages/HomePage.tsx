import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/input/FavoriteButton';
import { AnimatedContainer, FeaturedMovie, FeaturedMovieDetails, SizedBox, UIButton, UIButtonBar } from "../components/layout";
import { ThumbnailRow } from "../components/movie_thumbnails";
import MovieItem from '../components/movie_thumbnails/MovieItem';
import { SIDEBAR_WIDTH } from "../constants";
import { useAppDispatch, useAppSelector } from '../hooks/redux.hook';
import { publicLoadMovies } from '../redux/slices';
import { sliceIntoChunks, timeConvert } from '../utils/helpers';

const HomePage = () => {
  const { movies, featured } = useAppSelector(state => state.public);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(publicLoadMovies({ page: 1, limit: 50 }))
  }, [dispatch]);

  const items = useMemo(() => {
    return sliceIntoChunks(movies.items, 10);
  }, [movies]);

  return (
    <AnimatedContainer relative>
      <FeaturedMovie image={featured?.backdrop ?? ''} />
      <FeaturedMovieDetails>
        <h1>{ featured?.title ?? '' }</h1>
        <div className="sub_details">
          <span>{ featured?.release_year }</span>&middot;
          <span>{ timeConvert(featured?.runtime ?? 0) }</span>&middot;
          <span>{ featured?.rating ?? '-' } <FontAwesomeIcon icon={solid('star')} /></span>
        </div>
        <p>{ featured?.plot ?? '' }</p>
        <UIButtonBar>
          <FavoriteButton movieId={featured?.id!} />
          <UIButton onClick={() => navigate(`/browse/${featured?.id}`)}>
            <FontAwesomeIcon icon={solid('info-circle')} />
            <span>More Details</span>
          </UIButton>
        </UIButtonBar>
      </FeaturedMovieDetails>
      {
        items.map((item, index) => (
          <ThumbnailRow key={index} paddingLeft={SIDEBAR_WIDTH} rowTitle={ index === 0 ? "Latest Movies" : undefined }>
            { item.map(movie => (
              <MovieItem key={movie.id} movie={movie} />
            )) }
          </ThumbnailRow>
        ))
      }
      <SizedBox height={'56px'} />
    </AnimatedContainer>
  );
};

export default HomePage;
