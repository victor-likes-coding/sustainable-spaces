import { handleFileRemoval, handleFileUpload } from "~/utils/helper";
import InputFileArea from "./InputFileArea";
import InputFileUpload from "./InputFileUpload";

type Props = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  style: {
    upload?: string;
    uploadArea?: string;
  };
  UploadComponent?: React.ElementType;
  FileAreaComponent?: React.ElementType;
};

export default function Upload({
  files,
  setFiles,
  style,
  UploadComponent,
  FileAreaComponent,
}: Props) {
  const handleRemove = (index: number) => {
    const dataTransfer = handleFileRemoval(files, index);
    if (dataTransfer !== null && dataTransfer?.files?.length > 0)
      setFiles(dataTransfer.files);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ! TODO: check for image aspect ratio of square or horizontal orientation
    const dataTransfer = handleFileUpload(event, files);
    setFiles(dataTransfer.files);
  };

  const InputElement = UploadComponent || InputFileUpload;
  const FileAreaElement = FileAreaComponent || InputFileArea;

  return (
    <>
      <InputElement onChange={handleChange} className={style.upload} />
      <FileAreaElement
        onRemove={handleRemove}
        files={files}
        className={style.uploadArea}
      />
    </>
  );
}
