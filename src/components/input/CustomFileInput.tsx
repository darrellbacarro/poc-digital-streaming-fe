import { FileCard, FileRejection, FileUploader, MimeType } from "evergreen-ui";
import { FC, useCallback, useEffect, useState } from "react";

type CustomFileInputProps = {
  label?: string;
  description?: string;
  maxFiles?: number;
  maxSize?: number;
  mimeTypes?: MimeType[];
  id?: string;
  onChange: (files: File[]) => void;
};

const CustomFileInput: FC<CustomFileInputProps> = ({
  label,
  description,
  maxFiles = 1,
  maxSize = 5,
  mimeTypes = [MimeType.jpeg, MimeType.png, MimeType.gif, MimeType.svg],
  id,
  onChange,
}) => {
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

  useEffect(() => {
    if (onChange) onChange(files);
  }, [files, fileRejections]);

  return (
    <FileUploader
      label={label}
      description={description}
      maxSizeInBytes={maxSize * 1024 ** 2}
      maxFiles={maxFiles}
      acceptedMimeTypes={mimeTypes}
      data-testid={id}
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
  );
};

export default CustomFileInput;
