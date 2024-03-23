// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { validatePropertyOwner } from "~/utils/helper";

// import Button from "~/components/button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { property } = await validatePropertyOwner(params, request);

  return json({
    property,
  });
};

export default function Property() {
  return (
    <div className="w-full h-without-nav-fixed bg-primary text-white">
      <main className="px-4 h-full flex flex-col pt-6">edit</main>
    </div>
  );
}
