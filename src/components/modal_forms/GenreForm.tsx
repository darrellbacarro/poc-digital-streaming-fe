import {
  Button,
  Dialog, SelectField,
  TextInputField,
  toaster
} from "evergreen-ui";
import useForm from "rc-form-hooks";
import { cloneElement, FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Genre } from "../../redux/models";
import { doCreateGenre, doUpdateGenre } from "../../redux/slices";

type GenreFormProps = {
  children: any;
  genre?: Genre;
  title?: string;
  onComplete?: () => void;
};

const GenreForm: FC<GenreFormProps> = ({
  children,
  title = "Genre Form",
  onComplete = () => {},
  genre,
}) => {
  const {
    getFieldDecorator,
    validateFields,
    errors,
    errorsArr,
    resetFields,
    setFieldsValue,
  } = useForm<Partial<Genre>>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleConfirm = useCallback(async (e: any) => {
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    try {
      setLoading(true);
      const values = await validateFields();

      let ret = null;
      if (genre) {
        ret = await dispatch(doUpdateGenre({ id: genre.id, genre: values })).unwrap();
      } else {
        ret = await dispatch(doCreateGenre(values)).unwrap();
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
  }, [validateFields, setOpen, setLoading, onComplete, dispatch, genre]);

  useEffect(() => {
    if (!open) resetFields();
  }, [open]);

  useEffect(() => {
    if (genre && open) setFieldsValue(genre);
  }, [genre, open]);

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
              placeholder="Genre Title"
              name="title"
              
              validationMessage={
                !!errors.title && errors.title[0].message
              }
            />
          )}
          {getFieldDecorator("gradient", {
            initialValue: "premium-dark",
          })(
            <SelectField
              label="Gradient"
              placeholder="Genre Gradient"
              name="gradient"
              validationMessage={
                !!errors.gradient && errors.gradient[0].message
              }>
              <option value="red-salvation">Red Salvation</option>
              <option value="aqua-splash">Aqua Splash</option>
              <option value="spiky-naga">Spiky Naga</option>
              <option value="premium-dark">Premium Dark</option>
              <option value="jungle-day">Jungle Day</option>
            </SelectField>
          )}
          <Button data-testid="genre-form-submit" visibility="hidden">Submit</Button>
        </form>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default GenreForm;
