import TrashSVG from "./svg/Trash";

type Props = {
  files: FileList | null;
  onRemove?: (index: number) => void;
  className?: string;
};

export default function InputFileArea({
  files,
  onRemove,
  className = "",
}: Props) {
  return files && files.length > 0 ? (
    <div
      className={"flex flex-col items-center justify-center w-full bg-gray-500 rounded-lg border-dashed border-3 border-gray-700 px-4 gap-2 py-2 text-white overflow-y-scroll "
        .concat(className)
        .trim()}
    >
      {Array.from(files).map((file, index) => (
        <div
          key={index}
          className="flex w-full rounded-lg overflow-hidden text-xs gap-2 p-2 bg-slate-500 border border-white"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-6"
          />
          <div className="grow">
            {file.name.substring(0, 25)}
            {file.name.length > 25 && "..." + file.type.split("/")[1]}
          </div>
          {onRemove && (
            <button type="button" onClick={() => onRemove(index)}>
              <TrashSVG />
            </button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}
