import {
  Button,
  Dialog,
  FileCard,
  FileRejection,
  FileUploader,
  MimeType, SelectField, TextareaField,
  TextInputField,
  toaster
} from "evergreen-ui";
import useForm from "rc-form-hooks";
import { cloneElement, FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { Actor } from "../../redux/models";
import { doCreateActor, doUpdateActor } from "../../redux/slices";

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
    getFieldValue,
    validateFields,
    errors,
    errorsArr,
    isFieldTouched,
    resetFields,
    setFieldsValue,
  } = useForm<Partial<Actor>>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<File[]>([]);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);
  const handleChange = useCallback((files: File[]) => setFiles([files[0]]), []);
  const handleRejected = useCallback(
    (fileRejections: FileRejection[]) => setFileRejections([fileRejections[0]]),
    []
  );
  const handleRemove = useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

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
              isInvalid={!!errors.firstname}
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
              isInvalid={!!errors.lastname}
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
              isInvalid={!!errors.bio}
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
              isInvalid={!!errors.gender}
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
              isInvalid={!!errors.birthdate}
              validationMessage={
                !!errors.birthdate && errors.birthdate[0].message
              }
            />
          )}
          <FileUploader
            label="Actor Photo"
            description="You can upload 1 file. File can be up to 8 MB."
            maxSizeInBytes={8 * 1024 ** 2}
            maxFiles={1}
            acceptedMimeTypes={[
              MimeType.jpeg,
              MimeType.png,
              MimeType.gif,
              MimeType.svg,
            ]}
            onChange={handleChange}
            onRejected={handleRejected}
            renderFile={(file) => {
              const { name, size, type } = file;
              const fileRejection = fileRejections.find(
                (fileRejection: any) => fileRejection.file === file
              );
              const { message } = fileRejection || {};
              return (
                <FileCard
                  key={name}
                  isInvalid={fileRejection != null}
                  name={name}
                  onRemove={handleRemove}
                  sizeInBytes={size}
                  type={type}
                  validationMessage={message}
                />
              );
            }}
            values={files}
          />
          <Button visibility="hidden">Submit</Button>
        </form>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default ActorForm;
