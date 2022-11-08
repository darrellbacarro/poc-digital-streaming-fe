import { Avatar, Button, DeleteIcon, EditIcon, Heading, Pane, PlusIcon, Text } from 'evergreen-ui';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MovieDeleteConfirm from '../../components/modals/MovieDeleteConfirm';
import MovieForm from '../../components/modals/MovieForm';
import CustomTable, { TableColumnProps, TableControls, TableRowActions } from '../../components/ui/CustomTable';
import { DEFAULT_AVATAR, ROWS_PER_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { Genre, Movie } from '../../redux/models';
import { loadMovies } from '../../redux/slices';
import { LoadDataFilter } from '../../utils/api';

const MoviesPage = () => {
  const [filter, setFilter] = useState<LoadDataFilter>({ sort: 'title', page: 1, limit: ROWS_PER_PAGE });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: movies } = admin.movies;
  const dispatch = useAppDispatch();

  const handleLoadMovies = useCallback(() => {
    dispatch(loadMovies(filter));
  }, [filter, dispatch]);

  const handleSearch = useCallback(debounce((search: string) => {
    setFilter({ q: search, page: 1, limit: ROWS_PER_PAGE, sort: 'title' });
  }, 200), [dispatch, setFilter]);

  const handlePageChange = useCallback(debounce((page: number) => {
    setFilter((filter) => ({ ...filter, page, limit: ROWS_PER_PAGE }));
  }, 200), []);

  useEffect(() => {
    dispatch(loadMovies(filter));
  }, [filter, dispatch]);

  const cols = useMemo((): TableColumnProps[] => [
    {
      key: "title",
      label: "Title",
      searchable: true,
      render: (value: string, data: Movie) => {
        return (
          <Pane display="flex" gap={10} alignItems="center">
            <Avatar src={data.poster ?? DEFAULT_AVATAR} size={24} />
            <Text fontSize={12}>{value}</Text>
          </Pane>
        );
      }
    },
    {
      key: "release_year",
      label: "Release Year",
    },
    {
      key: "rating",
      label: "Avg. Rating",
      render: (value?: number) => {
        return <Text fontSize={12}>{ value ?? 'No Rating' }</Text>
      }
    },
    {
      key: "genres",
      label: "Genres",
      render: (value: Genre[]) => {
        return (
          <Text fontSize={12}>{
            (value ?? ['No Genre Specified']).map((genre: Genre) => genre.title).join(', ')
          }</Text>
        );
      }
    },
    {
      key: "id",
      label: "Actions",
      render: (_value: string, data: Movie) => (
        <TableRowActions>
          <MovieForm movie={data} title="Edit Movie" onComplete={handleLoadMovies}>
            <Button iconBefore={EditIcon} appearance="minimal" size="small">Edit</Button>
          </MovieForm>
          <MovieDeleteConfirm movie={data} onComplete={handleLoadMovies}>
            <Button
              iconBefore={DeleteIcon}
              appearance="minimal"
              intent="danger"
              size="small">Delete</Button>
          </MovieDeleteConfirm>
        </TableRowActions>
      ),
    },
  ], [session]);


  return (
    <>
      <TableControls>
        <Heading size={600}>Movies</Heading>
        <MovieForm title='Add Movie' onComplete={handleLoadMovies}>
          <Button data-testid="add-movie-btn" iconBefore={PlusIcon} appearance="primary">Add Movie</Button>
        </MovieForm>
      </TableControls>
      <CustomTable
        columns={cols}
        data={movies}
        searchPlaceholder="Search Movies"
        totalItems={total}
        page={filter.page ?? 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default MoviesPage;
