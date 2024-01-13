// import { Form, Link } from "@remix-run/react";

import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
import PropertyCard from "~/components/propertycard";
import { db } from "~/utils/db.server";

// import Button from "~/components/button";

export const loader = async () => {
  return json({
    properties: await db.property.findMany(),
  });
};

const fakeData = [
  {
    id: 1,
    address: "1234 Main St",
    city: "San Francisco",
    state: "CA",
    zip: 94111,
    price: 300000,
    beds: 3,
    baths: 2,
    sqft: 2000,
    tax: 3400,
    hoa: 1200,
    yearBuilt: 2000,
    management: 2400,
    insurance: 1200,
    capex: 1200,
    vacancy: 1200,
    updated: new Date(),
    created: new Date(),
    rent: 3000,
    payment: 1000,
    garage: 2,
    owner: "1",
    tenant: "2",
  },
];

export default function Property() {
  // const properties = useLoaderData<typeof loader>;
  const property = fakeData[0];

  return (
    <div className="w-full h-without-nav-fixed bg-primary text-white">
      <main className="px-4 h-full flex flex-col pt-6">
        <h1 className="text-4xl font-bold text-center pb-4">Properties</h1>
        <div className="properties-list w-full">
          <PropertyCard {...property} />
        </div>
      </main>
    </div>
  );
}
