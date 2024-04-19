import type { SVGProps } from "react";

export function CharmMenuHamburger(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.85}
        d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
      ></path>
    </svg>
  );
}
