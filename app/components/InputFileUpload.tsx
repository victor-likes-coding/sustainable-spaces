import { ChangeEvent } from "react";

type Props = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function InputFileUpload({ onChange, className = "" }: Props) {
  return (
    <>
      <button
        type="button"
        className={"flex w-full bg-sky-400 text-white p-2 justify-center text-sm py-4 rounded-lg "
          .concat(className)
          .trim()}
        onClick={() => {
          const input = document.getElementById("file");
          input?.click();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5 mr-2"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M11.678 20.271C7.275 21.318 4 25.277 4 30c0 5.523 4.477 10 10 10c.947 0 1.864-.132 2.733-.378m19.322-19.351c4.403 1.047 7.677 5.006 7.677 9.729c0 5.523-4.477 10-10 10c-.947 0-1.864-.132-2.732-.378M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12m5.065 7.881L24 20.924L31.132 28M24 38V24.462"
          />
        </svg>
        Upload File
        <input
          type="file"
          name="file"
          id="file"
          multiple
          accept="image/*"
          className="hidden-input hidden"
          onChange={onChange}
        />
      </button>
    </>
  );
}
