import { Dialog, Text, toaster } from "evergreen-ui";
import { cloneElement, FC, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Actor } from "../../redux/models";
import { doDeleteActor } from "../../redux/slices";

type ActorDeleteConfirmProps = {
  children: any;
  actor: Actor;
  onComplete?: () => void;
};

const ActorDeleteConfirm: FC<ActorDeleteConfirmProps> = ({
  children,
  actor,
  onComplete = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const ret = await dispatch(doDeleteActor(actor.id)).unwrap();

      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      setOpen(false);
      onComplete();
    } catch (err: any) {
      toaster.danger(err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [actor, onComplete]);

  return (
    <>
      <Dialog
        title="Delete Actor"
        isShown={open}
        onCloseComplete={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmLabel="Delete"
        isConfirmLoading={loading}
        intent="danger"
      >
        <Text>Are you sure you want to delete <strong>{ [actor.firstname,actor.lastname].join(' ') }</strong>?</Text>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default ActorDeleteConfirm;
