import {
  Button,
  DeleteIcon,
  EditIcon,
  Heading,
  PlusIcon,
  Select,
  toaster
} from "evergreen-ui";
import { useCallback, useMemo } from "react";
import CustomTable, {
  TableColumnProps,
  TableControls,
  TableRowActions
} from "../../components/layout/CustomTable";
import GenreDeleteConfirm from "../../components/modal_forms/GenreDeleteConfirm";
import GenreForm from "../../components/modal_forms/GenreForm";
import { usePaginatedSearch } from "../../hooks/paginated-search.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { Genre } from "../../redux/models";
import { doUpdateGenre, loadGenres } from "../../redux/slices";

const GenresPage = () => {
  const { filter, handlePageChange, handleSearch, handleLoad } =
    usePaginatedSearch(loadGenres, { sort: "title", page: 1 });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: genres } = admin.genres;
  const dispatch = useAppDispatch();

  const handleQuickUpdate = useCallback(
    async (id: string, data: { [key: string]: any }) => {
      try {
        const ret = await dispatch(doUpdateGenre({ id, genre: data })).unwrap();

        if (!ret.success) throw new Error(ret.message);

        toaster.success(ret.message, { duration: 1 });
        dispatch(loadGenres(filter));
      } catch (e: any) {
        toaster.danger(e?.message ?? e);
      }
    },
    [filter, dispatch]
  );

  const cols = useMemo(
    (): TableColumnProps[] => [
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
              onChange={(e) =>
                handleQuickUpdate(data.id, { gradient: e.target.value })
              }
              height={24}
            >
              <option value="red-salvation">Red Salvation</option>
              <option value="aqua-splash">Aqua Splash</option>
              <option value="spiky-naga">Spiky Naga</option>
              <option value="premium-dark">Premium Dark</option>
              <option value="jungle-day">Jungle Day</option>
            </Select>
          );
        },
      },
      {
        key: "id",
        label: "Actions",
        render: (_value: string, data: Genre) => (
          <TableRowActions>
            <GenreForm
              genre={data}
              title="Edit Genre"
              onComplete={handleLoad}
            >
              <Button iconBefore={EditIcon} appearance="minimal" size="small">
                Edit
              </Button>
            </GenreForm>
            <GenreDeleteConfirm
              genre={data}
              onComplete={handleLoad}
            >
              <Button
                iconBefore={DeleteIcon}
                appearance="minimal"
                intent="danger"
                size="small"
              >
                Delete
              </Button>
            </GenreDeleteConfirm>
          </TableRowActions>
        ),
      },
    ],
    [session]
  );

  return (
    <>
      <TableControls>
        <Heading size={600}>Genres</Heading>
        <GenreForm title="Add Genre" onComplete={handleLoad}>
          <Button data-testid="add-genre-btn" iconBefore={PlusIcon} appearance="primary">
            Add Genre
          </Button>
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
