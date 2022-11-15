import {
  Button,
  Dialog, SelectField, TextareaField,
  TextInputField,
  toaster
} from "evergreen-ui";
import useForm from "rc-form-hooks";
import { cloneElement, FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Actor } from "../../redux/models";
import { doCreateActor, doUpdateActor } from "../../redux/slices";
import CustomFileInput from "../input/CustomFileInput";

type ActorFormProps = {
  children: any;
  actor?: Actor;
  title?: string;
  onComplete?: () => void;
};

const ActorForm: FC<ActorFormProps> = ({
  children,
  title = "Actor Form",
  onComplete = () => {},
  actor,
}) => {
  const {
    getFieldDecorator,
    validateFields,
    errors,
    errorsArr,
    resetFields,
    setFieldsValue,
  } = useForm<Partial<Actor>>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<File[]>([]);

  const handleConfirm = useCallback(async (e: any) => {
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    try {
      setLoading(true);
      const values = await validateFields();

      const payload: any = {...values};

      if (files.length > 0) {
        payload.photo = files[0];
      }

      let ret = null;
      if (actor) {
        ret = await dispatch(doUpdateActor({ id: actor.id, actor: payload })).unwrap();
      } else {
        ret = await dispatch(doCreateActor(payload)).unwrap();
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
  }, [validateFields, setOpen, setLoading, onComplete, dispatch, actor, files]);

  useEffect(() => {
    if (!open) resetFields();
  }, [open]);

  useEffect(() => {
    if (actor && open) setFieldsValue(actor);
  }, [actor, open]);

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
          {getFieldDecorator("firstname", {
            rules: [{ required: true, message: "Firstname is required" }],
            initialValue: "",
          })(
            <TextInputField
              autoFocus
              label="First Name"
              placeholder="First Name"
              name="firstname"
              
              validationMessage={
                !!errors.firstname && errors.firstname[0].message
              }
            />
          )}
          {getFieldDecorator("lastname", {
            initialValue: "",
          })(
            <TextInputField
              label="Last Name"
              placeholder="Last Name"
              name="lastname"
              
              validationMessage={
                !!errors.lastname && errors.lastname[0].message
              }
            />
          )}
          {getFieldDecorator("bio", {
            rules: [{ required: true, message: "Bio is required" }],
            initialValue: "",
          })(
            <TextareaField
              rows={4}
              label="Biography"
              placeholder="Biography"
              name="bio"
              
              validationMessage={
                !!errors.bio && errors.bio[0].message
              }
            />
          )}
          {getFieldDecorator("gender", {
            rules: [{ required: true, message: "Gender is required" }],
            initialValue: "M",
          })(
            <SelectField
              label="Gender"
              placeholder="Gender"
              name="gender"
              
              validationMessage={
                !!errors.gender && errors.gender[0].message
              }>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </SelectField>
          )}
          {getFieldDecorator("birthdate", {
            rules: [{ required: true, message: "Birthdate is required" }],
            initialValue: "",
          })(
            <TextInputField
              label="Birthdate"
              placeholder="Birthdate"
              name="birthdate"
              type="date"
              
              validationMessage={
                !!errors.birthdate && errors.birthdate[0].message
              }
            />
          )}
          <CustomFileInput
            onChange={(files) => setFiles(files)}
            label="Actor Photo"
            description="You can upload 1 file. File can be up to 8 MB."
            maxFiles={1}
            id="actor-photo"
          />
          <Button data-testid="actor-form-submit" visibility="hidden">Submit</Button>
        </form>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default ActorForm;
