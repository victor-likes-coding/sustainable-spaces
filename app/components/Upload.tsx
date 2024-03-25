import InputFileArea from "./InputFileArea";
import InputFileUpload from "./InputFileUpload";

type Props = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  style: {
    upload?: string;
    uploadArea?: string;
  };
};

export default function Upload({ files, setFiles, style }: Props) {
  const handleRemove = (index: number) => {
    if (files) {
      const newFiles = Array.from(files);
      const dataTransfer = new DataTransfer();
      newFiles.splice(index, 1); // modifies the array directly
      newFiles.forEach((file) => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    const dataTransfer = new DataTransfer();

    // add existing files
    if (files) {
      Array.from(files).forEach((file) => dataTransfer.items.add(file));
    }

    if (newFiles) {
      Array.from(newFiles).forEach((file) => dataTransfer.items.add(file));
    }

    setFiles(dataTransfer.files);
  };

  return (
    <>
      <InputFileUpload onChange={handleChange} className={style.upload} />
      <InputFileArea
        onRemove={handleRemove}
        files={files}
        className={style.uploadArea}
      />
    </>
  );
}
