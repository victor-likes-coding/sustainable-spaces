type Props = {
  text: string;
  className?: string;
  canRent: boolean;
};

const PurchaseTag = ({ text, className, canRent }: Props) => {
  const color = canRent ? "bg-green-700" : "bg-red-700";
  return (
    <div
      className={`tag bg-slate-500/50 text-white w-auto py-0.5 px-2 flex gap-2 items-baseline text-xs ${
        className ? className : ""
      }`.trim()}
    >
      <div className={`w-2 h-2 ${color} rounded-full`}></div>
      {text}
    </div>
  );
};

export default PurchaseTag;
