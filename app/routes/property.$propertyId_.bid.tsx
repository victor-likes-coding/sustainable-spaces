// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import invariant from "invariant";

// import Button from "~/components/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.propertyId, "Property ID is required");
  const property = await db.property.findUnique({
    where: { id: parseFloat(params.propertyId as string) },
  });

  if (!property) {
    throw new Response("Not Found", { status: 404 });
  }

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
