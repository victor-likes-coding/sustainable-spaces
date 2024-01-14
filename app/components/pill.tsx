import { SwipeableHandlers } from "react-swipeable";

type Props = {
  showContent: boolean;
  className?: string;
  handler?: SwipeableHandlers;
};

const Pill = ({ showContent, className, handler }: Props) => {
  // ! TODO: Fix swipeable handlers to work on pill
  const customClassName =
    `relative border-t rounded-md transition-all duration-300 ease-in-out ${
      showContent ? "hidden" : "h-6"
    } ${className}`.trim();

  const pillButton = (
    <button className="relative my-2 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gray-400 rounded-full cursor-pointer transition-transform hover:scale-110"></button>
  );
  return handler ? (
    <div className={customClassName} {...handler}>
      {pillButton}
    </div>
  ) : (
    <div className={customClassName}>{pillButton}</div>
  );
};

export default Pill;
