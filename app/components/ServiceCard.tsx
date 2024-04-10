import { Link } from "@remix-run/react";

type Props = {
  url: string;
  title: string;
  style?: {
    outer?: string;
    svg?: string;
    title?: string;
  };
  to: string;
};

export function ServiceCard({ title, url, style, to }: Props) {
  return (
    <Link to={to} className="">
      <div
        className={"service-card p-4 rounded-md border bg-white drop-shadow-md "
          .concat(style?.outer ? ` ${style.outer}` : "")
          .trim()}
      >
        <div
          className={"svg-wrapper w-full ".concat(style?.svg ? style?.svg : "")}
        >
          <img src={url} alt="Search for house" />
        </div>
        <div
          className={"service-card-body mt-2 ".concat(
            style?.title ? style?.title : ""
          )}
        >
          <div className="service-card-title">{title}</div>
        </div>
      </div>
    </Link>
  );
}
