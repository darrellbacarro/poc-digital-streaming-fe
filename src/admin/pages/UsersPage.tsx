import {
  Avatar,
  Button,
  DeleteIcon,
  EditIcon,
  Heading,
  Pane,
  PlusIcon,
  Select,
  Text,
  toaster
} from "evergreen-ui";
import { useCallback, useMemo } from "react";
import CustomTable, {
  TableColumnProps,
  TableControls,
  TableRowActions
} from "../../components/layout/CustomTable";
import UserDeleteConfirm from "../../components/modal_forms/UserDeleteConfirm";
import UserForm from "../../components/modal_forms/UserForm";
import { DEFAULT_AVATAR } from "../../constants";
import { usePaginatedSearch } from "../../hooks/paginated-search.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { User } from "../../redux/models";
import { doUpdateUser, loadUsers } from "../../redux/slices";

const UsersPage = () => {
  const { filter, handlePageChange, handleSearch, handleLoad } =
    usePaginatedSearch(loadUsers, { sort: "fullname", page: 1 });
  const { admin, session } = useAppSelector((state) => state);
  const { total, items: users } = admin.users;
  const dispatch = useAppDispatch();

  const handleQuickUpdate = useCallback(
    async (id: string, data: { [key: string]: any }) => {
      try {
        const ret = await dispatch(doUpdateUser({ id, user: data })).unwrap();

        if (!ret.success) throw new Error(ret.message);

        toaster.success(ret.message, { duration: 1 });
        handleLoad();
      } catch (e: any) {
        toaster.danger(e?.message ?? e);
      }
    },
    []
  );

  const cols = useMemo(
    (): TableColumnProps[] => [
      {
        key: "fullname",
        label: "Fullname",
        searchable: true,
        render: (value: string, data: User) => {
          return (
            <Pane display="flex" gap={10} alignItems="center">
              <Avatar src={data.photo ?? DEFAULT_AVATAR} size={24} />
              <Text fontSize={12}>{value}</Text>
            </Pane>
          );
        },
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "role",
        label: "Role",
        render: (value: string, data: User) => {
          return (
            <Select
              disabled={session?.userData?.id === data.id}
              defaultValue={value}
              onChange={(e) =>
                handleQuickUpdate(data.id, { role: e.target.value })
              }
              height={24}
              width={100}
            >
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </Select>
          );
        },
      },
      {
        key: "approved",
        label: "Approved",
        render: (value: boolean, data: User) => {
          return (
            <Select
              disabled={session?.userData?.id === data.id}
              defaultValue={value ? "APPROVED" : "PENDING"}
              onChange={(e) =>
                handleQuickUpdate(data.id, {
                  approved: e.target.value === "APPROVED",
                })
              }
              height={24}
              width={100}
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
            </Select>
          );
        },
      },
      {
        key: "id",
        label: "Actions",
        render: (_value: string, data: User) => (
          <TableRowActions>
            <UserForm
              user={data}
              title="Edit User"
              onComplete={handleLoad}
            >
              <Button
                data-testid="edit-btn"
                iconBefore={EditIcon}
                appearance="minimal"
                size="small"
              >
                Edit
              </Button>
            </UserForm>
            <UserDeleteConfirm
              user={data}
              onComplete={handleLoad}
            >
              <Button
                disabled={session?.userData?.id === data.id}
                iconBefore={DeleteIcon}
                appearance="minimal"
                intent="danger"
                size="small"
              >
                Delete
              </Button>
            </UserDeleteConfirm>
          </TableRowActions>
        ),
      },
    ],
    [session]
  );

  return (
    <>
      <TableControls>
        <Heading size={600}>Users</Heading>
        <UserForm title="Add User" onComplete={handleLoad}>
          <Button
            data-testid="add-user-btn"
            iconBefore={PlusIcon}
            appearance="primary"
          >
            Add User
          </Button>
        </UserForm>
      </TableControls>
      <CustomTable
        columns={cols}
        data={users}
        searchPlaceholder="Search Users"
        totalItems={total}
        page={filter.page ?? 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default UsersPage;
