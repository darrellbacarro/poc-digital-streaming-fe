import { useEffect, useMemo, useState } from "react";
import {
  AnimatedContainer, SizedBox
} from "../components/layout";
import { usePublicLayoutContext } from "../components/layout/PublicLayout";
import { ThumbnailRow } from "../components/movie";
import { FeaturedMovie } from "../components/movie/FeaturedMovie";
import MovieItem from "../components/movie/MovieItem";
import { SIDEBAR_WIDTH } from "../constants";
import { usePaginatedSearch } from "../hooks/paginated-search.hook";
import { useAppSelector } from "../hooks/redux.hook";
import { Movie } from "../redux/models";
import { publicLoadMovies } from "../redux/slices";
import { sliceIntoChunks } from "../utils/helpers";

const HomePage = () => {
  const { filter, handlePageChange } = usePaginatedSearch(publicLoadMovies, { page: 1, limit: 20 });
  const { movies, featured } = useAppSelector((state) => state.public);
  const { atBottom, setAtBottom } = usePublicLayoutContext();

  const [movieItems, setMovieItems] = useState<Movie[]>(movies.items);

  useEffect(() => {
    setMovieItems((prev) => [...prev, ...movies.items]);
  }, [movies]);

  const items = useMemo(() => {
    return sliceIntoChunks(movieItems, 10);
  }, [movieItems]);

  useEffect(() => {
    if (atBottom) {
      const totalPage = Math.ceil(movies.total / 20);
      const nextPage = (filter.page ?? 1) + 1;

      if (nextPage <= totalPage) {
        handlePageChange((filter.page ?? 1) + 1);
        setAtBottom(false);
      }
    }
  }, [atBottom, setAtBottom, filter, handlePageChange]);

  return (
    <AnimatedContainer relative>
      <FeaturedMovie movie={featured!} />
      {items.map((item, index) => (
        <ThumbnailRow
          key={index}
          paddingLeft={SIDEBAR_WIDTH}
          rowTitle={index === 0 ? "Latest Movies" : undefined}
        >
          {item.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))}
        </ThumbnailRow>
      ))}
      <SizedBox height={"56px"} />
    </AnimatedContainer>
  );
};

export default HomePage;
