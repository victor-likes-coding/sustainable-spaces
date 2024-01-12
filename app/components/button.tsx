type Props = {
  text: string;
  className?: string;
};

const Button = ({ text, className }: Props) => {
  return (
    <button
      type="button"
      className={`bg-green-700 font-bold px-2 py-2 rounded-full mx-12 ${className}`.trim()}
    >
      {text}
    </button>
  );
};

export default Button;
