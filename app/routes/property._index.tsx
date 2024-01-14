// import { Form, Link } from "@remix-run/react";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import PropertyCard from "~/components/propertycard";
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
    <>
      <Navbar />
      <div className="w-full h-without-nav-auto bg-primary text-white">
        <main className="px-4 h-full flex flex-col pt-6">
          <h1 className="text-4xl font-bold text-center pb-4">Properties</h1>
          <div className="properties-list w-full flex flex-col gap-4 pb-4">
            {properties.properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
