import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ActorGrid } from '../components/actor_thumbnails/ActorGrid';
import { AnimatedContainer, Content, PageTransition } from '../components/layout';
import { ThumbnailRow } from '../components/movie';
import MovieItem from '../components/movie/MovieItem';
import { useAppDispatch, useAppSelector } from '../hooks/redux.hook';
import { Movie } from '../redux/models';
import { clearSearchResults, doSearch } from '../redux/slices';

const SearchPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { searchResults } = useAppSelector((state) => state.public);
  const dispatch = useAppDispatch();

  const search = useMemo(() => {
    return sp.get('q');
  }, [sp]);

  useEffect(() => {
    if (!search) {
      dispatch(clearSearchResults());
      navigate('/');
    } else {
      dispatch(doSearch(search));
    }
  }, [search, navigate, dispatch]);

  return (
    <AnimatedContainer transition={PageTransition.FADEIN}>
      <Content>
        <h1>
          {
            searchResults.movies.length + searchResults.actors.length === 0
              ? 'No results found'
              : `Search results for: ${search}`
          }
        </h1>
        {
          searchResults.movies.length > 0 && (
            <ThumbnailRow>
              {
                searchResults.movies.map((movie: Movie) => (
                  <MovieItem key={movie.id} movie={movie} />
                ))
              }
            </ThumbnailRow>
          )
        }
        {
          searchResults.actors.length > 0 && (
            <>
              <h2>Actors Found</h2>
              <ActorGrid actors={searchResults.actors}/>
            </>
          )
        }
      </Content>
    </AnimatedContainer>
  );
};

export default SearchPage;
