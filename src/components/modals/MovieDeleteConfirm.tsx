import { Dialog, Text, toaster } from "evergreen-ui";
import { cloneElement, FC, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Movie } from "../../redux/models";
import { doDeleteMovie } from "../../redux/slices";

type MovieDeleteConfirmProps = {
  children: any;
  movie: Movie;
  onComplete?: () => void;
};

const MovieDeleteConfirm: FC<MovieDeleteConfirmProps> = ({
  children,
  movie,
  onComplete = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      const ret = await dispatch(doDeleteMovie(movie.id)).unwrap();

      if (!ret.success) throw new Error(ret.message);

      toaster.success(ret.message, { duration: 1 });
      setOpen(false);
      onComplete();
    } catch (err: any) {
      toaster.danger(err?.message ?? err);
    } finally {
      setLoading(false);
    }
  }, [movie, onComplete]);

  return (
    <>
      <Dialog
        title="Delete Movie"
        isShown={open}
        onCloseComplete={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmLabel="Delete"
        isConfirmLoading={loading}
        intent="danger"
      >
        <Text>Are you sure you want to delete <strong>{ movie.title }</strong>?</Text>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default MovieDeleteConfirm;
