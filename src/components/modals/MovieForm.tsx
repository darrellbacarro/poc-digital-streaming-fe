import {
  Button,
  Dialog, FilePicker, FormField, TextareaField,
  TextInputField,
  toaster
} from "evergreen-ui";
import useForm from "rc-form-hooks";
import { cloneElement, FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Movie } from "../../redux/models";
import { doCreateMovie, doUpdateMovie } from "../../redux/slices";
import MultiActorSelect from "../input/MultiActorSelect";
import MultiGenreSelect from "../input/MultiGenreSelect";

type MovieFormProps = {
  children: any;
  movie?: Movie;
  title?: string;
  onComplete?: () => void;
};

const MovieForm: FC<MovieFormProps> = ({
  children,
  title = "Movie Form",
  onComplete = () => {},
  movie,
}) => {
  const {
    getFieldDecorator,
    validateFields,
    errors,
    errorsArr,
    resetFields,
    setFieldsValue,
  } = useForm<Partial<Movie>>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [poster, setPoster] = useState<File | null>(null);
  const [backdrop, setBackdrop] = useState<File | null>(null);

  const handleConfirm = useCallback(async (e: any) => {
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    try {
      setLoading(true);

      if (!poster && !movie) throw new Error("Poster is required");
      if (!backdrop && !movie) throw new Error("Backdrop is required");

      const values = await validateFields();
      const payload: any = {...values};

      if (poster) payload.poster = poster;
      if (backdrop) payload.backdrop = backdrop;

      let ret = null;
      if (movie) {
        ret = await dispatch(doUpdateMovie({ id: movie.id, movie: payload })).unwrap();
      } else {
        ret = await dispatch(doCreateMovie(payload)).unwrap();
      }

      if (!ret?.success) throw new Error(ret?.message);

      toaster.success(ret?.message, { duration: 1 });
      setOpen(false);
      onComplete();
    } catch (e: any) {
      toaster.danger(e?.message ?? e);
    } finally {
      setLoading(false);
    }
  }, [validateFields, setOpen, setLoading, onComplete, dispatch, movie, poster, backdrop]);

  useEffect(() => {
    if (!open) resetFields();
  }, [open]);

  useEffect(() => {
    if (movie) setFieldsValue(movie);
  }, [movie, open]);

  return (
    <>
      <Dialog
        isShown={open}
        title={title}
        onCloseComplete={() => setOpen(false)}
        confirmLabel="Save"
        onConfirm={handleConfirm}
        isConfirmLoading={loading}
        isConfirmDisabled={errorsArr.length > 0}
      >
        <form onSubmit={handleConfirm}>
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "Title is required" }],
            initialValue: "",
          })(
            <TextInputField
              autoFocus
              label="Title"
              placeholder="Title"
              name="title"
              isInvalid={!!errors.title}
              validationMessage={
                !!errors.title && errors.title[0].message
              }
            />
          )}
          {getFieldDecorator("plot", {
            rules: [{ required: true, message: "Plot is required" }],
            initialValue: "",
          })(
            <TextareaField
              rows={4}
              label="Plot"
              placeholder="Plot"
              name="plot"
              isInvalid={!!errors.plot}
              validationMessage={
                !!errors.plot && errors.plot[0].message
              }
            />
          )}
          {getFieldDecorator("cost", {
            rules: [
              { required: true, message: "Cost is required" },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Cost"
              placeholder="Cost"
              name="cost"
              type="number"
              isInvalid={!!errors.cost}
              validationMessage={!!errors.cost && errors.cost[0].message}
            />
          )}
          {getFieldDecorator("release_year", {
            rules: [
              { required: true, message: "Release Year is required" },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Release Year"
              placeholder="Release Year"
              name="release_year"
              type="number"
              isInvalid={!!errors.release_year}
              validationMessage={!!errors.release_year && errors.release_year[0].message}
            />
          )}
          {getFieldDecorator("runtime", {
            rules: [
              { required: true, message: "Runtime is required" },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Runtime"
              placeholder="Runtime"
              name="runtime"
              isInvalid={!!errors.runtime}
              validationMessage={!!errors.runtime && errors.runtime[0].message}
            />
          )}
          <FormField
            marginBottom={24}
            label="Poster"
            placeholder="Poster"
            name="poster"
          >
            <FilePicker onChange={(files) => {
              if (files.length > 0) {
                setPoster(files[0]);
              } else {
                setPoster(null);
              }
            }} multiple={false} />
          </FormField>
          <FormField
            marginBottom={24}
            label="Backdrop"
            placeholder="Backdrop"
            name="backdrop"
          >
            <FilePicker onChange={(files) => {
              if (files.length > 0) {
                setBackdrop(files[0]);
              } else {
                setBackdrop(null);
              }
            }} multiple={false} />
          </FormField>
          <FormField
            marginBottom={24}
            label="Actors"
            name="actors"
            isInvalid={!!errors.actors}
            validationMessage={!!errors.actors && errors.actors[0].message}>
            {getFieldDecorator("actors", {
              rules: [{ required: !movie, message: "Actors list is required" }],
              initialValue: [],
            })(
              <MultiActorSelect />
            )}
          </FormField>
          <FormField
            label="Genres"
            name="genres"
            isInvalid={!!errors.genres}
            validationMessage={!!errors.genres && errors.genres[0].message}>
            {getFieldDecorator("genres", {
              initialValue: [],
            })(
              <MultiGenreSelect />
            )}
          </FormField>
          <Button data-testid="movie-form-submit" visibility="hidden">Submit</Button>
        </form>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default MovieForm;
