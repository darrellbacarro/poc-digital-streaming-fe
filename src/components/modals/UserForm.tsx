import {
  Button,
  Dialog,
  FileCard,
  FileRejection,
  FileUploader,
  MimeType,
  SelectField,
  TextInputField,
  toaster
} from "evergreen-ui";
import _ from "lodash";
import useForm from "rc-form-hooks";
import { cloneElement, FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux.hook";
import { User } from "../../redux/models";
import { doCreateUser, doUpdateUser } from "../../redux/slices";
import { validateEmailFromApi } from "../../utils/api";

type UserFormProps = {
  children: any;
  user?: User;
  title?: string;
  onComplete?: () => void;
};

const UserForm: FC<UserFormProps> = ({
  children,
  title = "User Form",
  onComplete = () => {},
  user,
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
  } = useForm<{
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>();
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

      const payload: any = {
        ..._.omit(values, ["confirmPassword"]),
        enabled: true,
        approved: true,
      };

      if (files.length > 0) {
        payload.photo = files[0];
      }

      let ret = null;
      if (user) {
        ret = await dispatch(doUpdateUser({ id: user.id, user: payload })).unwrap();
      } else {
        ret = await dispatch(doCreateUser(payload)).unwrap();
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
  }, [validateFields, setOpen, setLoading, onComplete, dispatch, user, files]);

  const compareToFirstPassword = useCallback(
    (_rule: any, value: any, callback: any) => {
      if (user) {
        callback();
        return;
      }

      if (value && value !== getFieldValue("password")) {
        callback("Passwords do not match!");
      } else {
        callback();
      }
    },
    [getFieldValue, user]
  );

  const validateToNextPassword = useCallback(
    (_rule: any, value: any, callback: any) => {
      if (user) {
        callback();
        return;
      }

      if (value && isFieldTouched("confirmPassword")) {
        validateFields(["confirmPassword"], { force: true });
      }
      callback();

    },
    [isFieldTouched, validateFields, user]
  );

  const validateEmail = useCallback(
    async (_rule: any, value: any, callback: any) => {
      const res = await validateEmailFromApi(value, user?.id);
      console.log(user);
      if (res?.success) {
        if (res?.data?.valid !== true) {
          callback("Email already in use");
        }
        return;
      }
      callback();
    },
    [user, open]
  );

  useEffect(() => {
    if (!open) resetFields();
  }, [open]);

  useEffect(() => {
    if (user && open) setFieldsValue(user);
  }, [user, open]);

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
          {getFieldDecorator("fullname", {
            rules: [{ required: true, message: "Fullname is required" }],
            initialValue: "",
          })(
            <TextInputField
              autoFocus
              label="Fullname"
              placeholder="Fullname"
              name="fullname"
              isInvalid={!!errors.fullname}
              validationMessage={
                !!errors.fullname && errors.fullname[0].message
              }
            />
          )}
          {getFieldDecorator("email", {
            rules: [
              { required: true, message: "Email is required" },
              { type: "email", message: "Email is invalid" },
              { validator: validateEmail },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Email Address"
              placeholder="Email Address"
              name="email"
              isInvalid={!!errors.email}
              validationMessage={!!errors.email && errors.email[0].message}
            />
          )}
          {getFieldDecorator("password", {
            rules: [
              { required: !user, message: "Password is required" },
              { validator: validateToNextPassword },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              isInvalid={!!errors.password}
              validationMessage={
                !!errors.password && errors.password[0].message
              }
              
            />
          )}
          {getFieldDecorator("confirmPassword", {
            rules: [
              { required: !user, message: "Please confirm your password" },
              { validator: compareToFirstPassword },
            ],
            initialValue: "",
          })(
            <TextInputField
              label="Confirm Password"
              placeholder="Confirm Password"
              name="confirm-password"
              type="password"
              isInvalid={!!errors.confirmPassword}
              validationMessage={
                !!errors.confirmPassword && errors.confirmPassword[0].message
              }
            />
          )}
          {getFieldDecorator("role", {
            rules: [{ required: true, message: "Role is required" }],
            initialValue: "USER",
          })(
            <SelectField
              label="User Role"
              placeholder="User Role"
              name="role"
              isInvalid={!!errors.role}
              validationMessage={
                !!errors.role && errors.role[0].message
              }>
              <option value="ADMIN">Administrator</option>
              <option value="USER">User</option>
            </SelectField>
          )}
          <FileUploader
            label="User Photo"
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
          <Button data-testid="user-form-submit" visibility="hidden">Submit</Button>
        </form>
      </Dialog>
      {cloneElement(children, {
        onClick: () => setOpen(true),
      })}
    </>
  );
};

export default UserForm;
