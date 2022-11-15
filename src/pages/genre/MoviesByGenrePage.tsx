import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AnimatedContainer, MainContent, SizedBox } from "../../components/layout";
import { Jumbotron } from "../../components/layout/Banner";
import { ThumbnailRow } from "../../components/movie";
import MovieItem from "../../components/movie/MovieItem";
import { SIDEBAR_WIDTH } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { loadMoviesByGenre } from "../../redux/slices";
import { sliceIntoChunks } from "../../utils/helpers";

const MoviesByGenrePage = () => {
  const { id } = useParams();
  const { currentGenre } = useAppSelector((state) => state.public);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(loadMoviesByGenre(id));
  }, [dispatch, id]);

  const items = useMemo(() => {
    if (currentGenre) return sliceIntoChunks(currentGenre.movies ?? [], 10);
    return [];
  }, [currentGenre]);
  
  return (
    <AnimatedContainer relative>
      <Jumbotron height={500} bg="genre" />
      <MainContent>
        <h1>{ currentGenre?.title ?? 'Genre' }</h1>
      </MainContent>
      {
        items.map((item, index) => (
          <ThumbnailRow paddingLeft={SIDEBAR_WIDTH}>
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

export default MoviesByGenrePage;