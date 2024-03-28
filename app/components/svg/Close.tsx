import React from "react";

type Props = {
  style?: {
    container?: string;
    svg?: string;
    button?: string;
  };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CloseSVG = ({ style, onClick }: Props) => {
  return (
    <button
      className={"image-container__delete-button absolute top-1 right-1 bg-danger rounded-md "
        .concat(style?.button || "")
        .trim()}
      aria-label="Delete Image"
      onClick={onClick}
      type="button"
    >
      <div className={style?.container}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={style?.svg || "w-6 h-6"}
        >
          <path
            fill="currentColor"
            d="m289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34Z"
          />
        </svg>
      </div>
    </button>
  );
};

export default CloseSVG;
