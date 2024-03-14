import { Spinner } from "@nextui-org/react";

type Label =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "foreground"
  | undefined;

type Color =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "default"
  | "current"
  | "white"
  | undefined;

type LoaderProps = {
  text?: string;
  labelColor?: Label;
  className?: string;
  color?: Color;
};

const Loader = ({ text, labelColor, className, color }: LoaderProps) => {
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-gray-800/50 backdrop-blur-sm flex justify-center items-center z-20 ${className}`.trim()}
    >
      <Spinner label={`${text}...`} labelColor={labelColor} color={color} />
    </div>
  );
};

export default Loader;
