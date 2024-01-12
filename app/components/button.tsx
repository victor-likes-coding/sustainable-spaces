import { Link } from "@remix-run/react";

type Props = {
  text: string;
  className?: string;
  link?: boolean;
  to?: string;
};

const Button = ({ text, className, to, link }: Props) => {
  return !link ? (
    <button
      type="button"
      className={`bg-green-700 font-bold px-2 py-2 rounded-full mx-2 small:mx-10 med:mx-14 large:w-[30%] large:mx-auto ${className}`.trim()}
    >
      {text}
    </button>
  ) : (
    <Link
      to={to ? to : ""}
      className={`bg-green-700 font-bold px-2 py-2 rounded-full mx-2 small:mx-10 med:mx-14 large:w-[30%] large:mx-auto ${className}`.trim()}
    >
      {text}
    </Link>
  );
};

export default Button;
