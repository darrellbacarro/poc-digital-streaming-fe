import dayjs from 'dayjs';
import { Avatar, Button, DeleteIcon, EditIcon, Heading, Pane, PlusIcon, Text } from 'evergreen-ui';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTable, { TableColumnProps, TableControls, TableRowActions } from '../../components/layout/CustomTable';
import ActorDeleteConfirm from '../../components/modal_forms/ActorDeleteConfirm';
import ActorForm from '../../components/modal_forms/ActorForm';
import { DEFAULT_AVATAR, ROWS_PER_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { Actor } from '../../redux/models';
import { loadActors } from '../../redux/slices';
import { LoadDataFilter } from '../../utils/api';

const ActorsPage = () => {
  const [filter, setFilter] = useState<LoadDataFilter>({ sort: 'fullname', page: 1, limit: ROWS_PER_PAGE });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: actors } = admin.actors;
  const dispatch = useAppDispatch();

  const handleLoadActors = useCallback(() => {
    dispatch(loadActors(filter));
  }, [filter, dispatch]);

  const handleSearch = useCallback(debounce((search: string) => {
    setFilter({ q: search, page: 1, limit: ROWS_PER_PAGE, sort: 'lastname,firstname' });
  }, 200), [dispatch, setFilter]);

  const handlePageChange = useCallback(debounce((page: number) => {
    setFilter((filter) => ({ ...filter, page, limit: ROWS_PER_PAGE }));
  }, 200), []);

  useEffect(() => {
    dispatch(loadActors(filter));
  }, [filter, dispatch]);

  const cols = useMemo((): TableColumnProps[] => [
    {
      key: "firstname",
      label: "Fullname",
      searchable: true,
      render: (value: string, data: Actor) => {
        return (
          <Pane display="flex" gap={10} alignItems="center">
            <Avatar src={data.photo ?? DEFAULT_AVATAR} size={24} />
            <Text fontSize={12}>{`${[data.firstname, data.lastname].join(' ')}`}</Text>
          </Pane>
        );
      }
    },
    {
      key: "gender",
      label: "Gender",
      render: (value: string) => {
        return (
          <Text fontSize={12}>{value === "M" ? "Male" : "Female"}</Text>
        );
      }
    },
    {
      key: "birthdate",
      label: "Age",
      render: (value: string) => {
        return (
          <Text fontSize={12}>{
            dayjs().diff(dayjs(value), 'year')
          }</Text>
        );
      }
    },
    {
      key: "id",
      label: "Actions",
      render: (_value: string, data: Actor) => (
        <TableRowActions>
          <ActorForm actor={data} title="Edit Actor" onComplete={handleLoadActors}>
            <Button iconBefore={EditIcon} appearance="minimal" size="small">Edit</Button>
          </ActorForm>
          <ActorDeleteConfirm actor={data} onComplete={handleLoadActors}>
            <Button
              iconBefore={DeleteIcon}
              appearance="minimal"
              intent="danger"
              size="small">Delete</Button>
          </ActorDeleteConfirm>
        </TableRowActions>
      ),
    },
  ], [session]);


  return (
    <>
      <TableControls>
        <Heading size={600}>Actors</Heading>
        <ActorForm title='Add Actor' onComplete={handleLoadActors}>
          <Button data-testid="add-actor-btn" iconBefore={PlusIcon} appearance="primary">Add Actor</Button>
        </ActorForm>
      </TableControls>
      <CustomTable
        columns={cols}
        data={actors}
        searchPlaceholder="Search Actors"
        totalItems={total}
        page={filter.page ?? 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default ActorsPage;
