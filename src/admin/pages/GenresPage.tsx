import { Button, DeleteIcon, EditIcon, Heading, PlusIcon, Select, toaster } from 'evergreen-ui';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GenreDeleteConfirm from '../../components/modals/GenreDeleteConfirm';
import GenreForm from '../../components/modals/GenreForm';
import CustomTable, { TableColumnProps, TableControls, TableRowActions } from '../../components/ui/CustomTable';
import { ROWS_PER_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { Genre } from '../../redux/models';
import { doUpdateGenre, loadGenres } from '../../redux/slices';
import { LoadDataFilter } from '../../utils/api';

const GenresPage = () => {
  const [filter, setFilter] = useState<LoadDataFilter>({ sort: 'title', page: 1, limit: ROWS_PER_PAGE });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: genres } = admin.genres;
  const dispatch = useAppDispatch();

  const handleLoadGenres = useCallback(() => {
    dispatch(loadGenres(filter));
  }, [filter, dispatch]);

  const handleQuickUpdate = useCallback(async (id: string, data: { [key: string]: any }) => {
    try {
      const ret = await dispatch(doUpdateGenre({ id, genre: data })).unwrap();
      
      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      dispatch(loadGenres(filter));
    } catch (e: any) {
      toaster.danger(e?.message ?? e);
    }
  }, [filter, dispatch]);

  const handleSearch = useCallback(debounce((search: string) => {
    setFilter({ q: search, page: 1, limit: ROWS_PER_PAGE, sort: 'title' });
  }, 200), [dispatch, setFilter]);

  const handlePageChange = useCallback(debounce((page: number) => {
    setFilter((filter) => ({ ...filter, page, limit: ROWS_PER_PAGE }));
  }, 200), []);

  useEffect(() => {
    dispatch(loadGenres(filter));
  }, [filter, dispatch]);

  const cols = useMemo((): TableColumnProps[] => [
    {
      key: "title",
      label: "Genre",
      searchable: true,
    },
    {
      key: "gradient",
      label: "Gradient",
      render: (value: string, data: Genre) => {
        return (
          <Select
            defaultValue={value}
            onChange={(e) => handleQuickUpdate(data.id, { gradient: e.target.value})}
            height={24}>
            <option value="red-salvation">Red Salvation</option>
            <option value="aqua-splash">Aqua Splash</option>
            <option value="spiky-naga">Spiky Naga</option>
            <option value="premium-dark">Premium Dark</option>
            <option value="jungle-day">Jungle Day</option>
          </Select>
        );
      }
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string, data: Genre) => (
        <TableRowActions>
          <GenreForm genre={data} title="Edit Genre" onComplete={handleLoadGenres}>
            <Button iconBefore={EditIcon} appearance="minimal" size="small">Edit</Button>
          </GenreForm>
          <GenreDeleteConfirm genre={data} onComplete={handleLoadGenres}>
            <Button
              iconBefore={DeleteIcon}
              appearance="minimal"
              intent="danger"
              size="small">Delete</Button>
          </GenreDeleteConfirm>
        </TableRowActions>
      ),
    },
  ], [session]);


  return (
    <>
      <TableControls>
        <Heading size={600}>Genres</Heading>
        <GenreForm title='Add Genre' onComplete={handleLoadGenres}>
          <Button iconBefore={PlusIcon} appearance="primary">Add Genre</Button>
        </GenreForm>
      </TableControls>
      <CustomTable
        columns={cols}
        data={genres}
        searchPlaceholder="Search Users"
        totalItems={total}
        page={filter.page ?? 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default GenresPage;
