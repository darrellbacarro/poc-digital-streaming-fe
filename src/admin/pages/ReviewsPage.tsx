import dayjs from 'dayjs';
import { Avatar, Heading, Pane, Select, Text, toaster } from 'evergreen-ui';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTable, { TableColumnProps, TableControls } from '../../components/ui/CustomTable';
import { DEFAULT_AVATAR, ROWS_PER_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { Movie, Review, User } from '../../redux/models';
import { doReviewApproval, loadReviews } from '../../redux/slices';
import { LoadDataFilter } from '../../utils/api';

const ReviewsPage = () => {
  const [filter, setFilter] = useState<LoadDataFilter>({ page: 1, limit: ROWS_PER_PAGE });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: reviews } = admin.reviews;
  const dispatch = useAppDispatch();

  const handleQuickUpdate = useCallback(async (id: string, data: string) => {
    try {
      const ret = await dispatch(doReviewApproval({ id, approved: data === "APPROVED" })).unwrap();
      
      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      dispatch(loadReviews(filter));
    } catch (e: any) {
      toaster.danger(e?.message ?? e);
    }
  }, [filter, dispatch]);

  const handleSearch = useCallback(debounce((search: string) => {
    setFilter({ q: search, limit: ROWS_PER_PAGE, page: 1 });
  }, 200), [dispatch, setFilter]);

  const handlePageChange = useCallback(debounce((page: number) => {
    setFilter((filter) => ({ ...filter, page, limit: ROWS_PER_PAGE }));
  }, 200), []);

  useEffect(() => {
    dispatch(loadReviews(filter));
  }, [filter, dispatch]);

  const cols = useMemo((): TableColumnProps[] => [
    {
      key: "user",
      label: "User",
      searchable: true,
      render: (value: User) => {
        return (
          <Pane display="flex" gap={10} alignItems="center">
            <Avatar src={value.photo ?? DEFAULT_AVATAR} size={24} />
            <Text fontSize={12}>{value.fullname}</Text>
          </Pane>
        );
      }
    },
    {
      key: "movie",
      label: "Movie",
      render: (value: Movie) => {
        return (
          <Pane display="flex" gap={10} alignItems="center">
            <Avatar src={value.poster ?? DEFAULT_AVATAR} size={24} />
            <Text fontSize={12}>{value.title}</Text>
          </Pane>
        );
      }
    },
    {
      key: "content",
      label: "Content",
      render: (value: string) => {
        return (
          <Text fontSize={12}>{value}</Text>
        );
      }
    },
    {
      key: "rating",
      label: "Rating",
    },
    {
      key: "postedAt",
      label: "Date Posted",
      render: (value: string) => {
        return (
          <Text fontSize={12}>{dayjs(value).format('MMMM D, YYYY h:mm A')}</Text>
        );
      }
    },
    {
      key: "approved",
      label: "Approval",
      render: (value: boolean, data: Review) => {
        return (
          <Select
            defaultValue={value ? "APPROVED" : "PENDING"}
            onChange={(e) => handleQuickUpdate(data._id, e.target.value)}
            height={24}
            width={100}>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </Select>
        );
      }
    },
  ], [session]);


  return (
    <>
      <TableControls>
        <Heading size={600}>Reviews</Heading>
      </TableControls>
      <CustomTable
        columns={cols}
        data={reviews}
        searchPlaceholder="Search Reviews"
        totalItems={total}
        page={filter.page ?? 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default ReviewsPage;
