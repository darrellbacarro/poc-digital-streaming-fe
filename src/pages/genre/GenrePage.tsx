import { useEffect } from "react";
import { GenreGrid } from "../../components/genre_thumbnails/GenreGrid";
import { AnimatedContainer, MainContent } from "../../components/layout";
import { Jumbotron } from "../../components/layout/Banner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { loadAllGenres } from "../../redux/slices";

const GenrePage = () => {
  const { genres: { items } } = useAppSelector((state) => state.public);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAllGenres());
  }, [dispatch]);

  return (
    <AnimatedContainer relative>
      <Jumbotron bg="genre" />
      <MainContent>
        <h1>Genres</h1>
        <GenreGrid genres={items} />
      </MainContent>
    </AnimatedContainer>
  );
};

export default GenrePage;