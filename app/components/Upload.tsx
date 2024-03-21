import InputFileArea from "./InputFileArea";
import InputFileUpload from "./InputFileUpload";

type Props = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
};

export default function Upload({ files, setFiles }: Props) {
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
    setFiles(event.target.files);
  };

  return (
    <>
      <InputFileUpload onChange={handleChange} />
      <InputFileArea onRemove={handleRemove} files={files} />
    </>
  );
}
