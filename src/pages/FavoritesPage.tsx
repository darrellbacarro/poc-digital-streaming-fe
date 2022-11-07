import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedContainer, MainContent, SizedBox } from "../components/layout";
import { Jumbotron } from "../components/layout/Banner";
import { ThumbnailRow } from "../components/movie_thumbnails";
import MovieItem from "../components/movie_thumbnails/MovieItem";
import { SIDEBAR_WIDTH } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { Movie } from "../redux/models";
import { loadFavoriteMovies } from "../redux/slices";
import { sliceIntoChunks } from "../utils/helpers";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { session: { userData }, public: { favoriteMovies = [] } } = useAppSelector((state) => state);

  useEffect(() => {
    if (!userData || userData?.role === 'ADMIN') navigate('/');
  }, [userData, navigate]);

  useEffect(() => {
    dispatch(loadFavoriteMovies(userData?.id!));
  }, [dispatch, userData]);

  const items = useMemo(() => {
    return sliceIntoChunks(favoriteMovies, 10);
  }, [favoriteMovies]);

  return (
    <AnimatedContainer relative>
      <Jumbotron bg="favorite" />
      <MainContent>
        <h1>Favorites</h1>
      </MainContent>
      {
        items.map((item, index) => (
          <ThumbnailRow key={index} paddingLeft={SIDEBAR_WIDTH}>
            { item.map((movie: Movie) => (
              <MovieItem key={movie.id} movie={movie} />
            )) }
          </ThumbnailRow>
        ))
      }
      <SizedBox height={'56px'} />
    </AnimatedContainer>
  );
};

export default FavoritesPage;