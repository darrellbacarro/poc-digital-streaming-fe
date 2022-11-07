import { Dialog, Text, toaster } from "evergreen-ui";
import { cloneElement, FC, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { User } from "../../redux/models";
import { doDeleteUser } from "../../redux/slices";

type UserDeleteConfirmProps = {
  children: any;
  user: User;
  onComplete?: () => void;
};

const UserDeleteConfirm: FC<UserDeleteConfirmProps> = ({
  children,
  user,
  onComplete = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const ret = await dispatch(doDeleteUser(user.id)).unwrap();

      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      setOpen(false);
      onComplete();
    } catch (err: any) {
      toaster.danger(err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [user, onComplete]);

  return (
    <>
      <Dialog
        title="Delete User"
        isShown={open}
        onCloseComplete={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmLabel="Delete"
        isConfirmLoading={loading}
        intent="danger"
      >
        <Text>Are you sure you want to delete <strong>{ user.fullname }</strong>?</Text>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default UserDeleteConfirm;
