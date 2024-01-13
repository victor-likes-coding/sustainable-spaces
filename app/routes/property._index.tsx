// import { Form, Link } from "@remix-run/react";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PropertyCard from "~/components/propertycard";
import { FullPropertyData } from "~/models/property";
import { db } from "~/utils/db.server";

// import Button from "~/components/button";

export const loader = async () => {
  return json({
    properties: await db.property.findMany(),
  });
};

export default function Property() {
  const properties = useLoaderData<typeof loader>();
  console.log(properties);

  return (
    <div className="w-full h-without-nav-auto bg-primary text-white">
      <main className="px-4 h-full flex flex-col pt-6">
        <h1 className="text-4xl font-bold text-center pb-4">Properties</h1>
        <div className="properties-list w-full flex flex-col gap-2 pb-2">
          {properties.properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </main>
    </div>
  );
}
