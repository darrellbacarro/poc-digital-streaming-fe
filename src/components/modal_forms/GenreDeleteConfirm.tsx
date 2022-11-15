import { Dialog, Text, toaster } from "evergreen-ui";
import { cloneElement, FC, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Genre } from "../../redux/models";
import { doDeleteGenre } from "../../redux/slices";

type GenreDeleteConfirmProps = {
  children: any;
  genre: Genre;
  onComplete?: () => void;
};

const GenreDeleteConfirm: FC<GenreDeleteConfirmProps> = ({
  children,
  genre,
  onComplete = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const ret = await dispatch(doDeleteGenre(genre.id)).unwrap();

      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      setOpen(false);
      onComplete();
    } catch (err: any) {
      toaster.danger(err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [genre, onComplete]);

  return (
    <>
      <Dialog
        title="Delete Genre"
        isShown={open}
        onCloseComplete={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmLabel="Delete"
        isConfirmLoading={loading}
        intent="danger"
      >
        <Text>Are you sure you want to delete <strong>{ genre.title }</strong>?</Text>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default GenreDeleteConfirm;
