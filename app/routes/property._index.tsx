// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Navbar from "~/components/navbar";
import PropertyCard from "~/components/propertycard";
import { BasicPropertyData } from "~/models/property";
import { db } from "~/utils/db.server";
import { TokenPayload, getLoggedInStatus } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";

// import Button from "~/components/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = await requireToken(request);
  try {
    const properties = await db.property.findMany();
    return json({
      properties,
      payload,
    });
  } catch (error) {
    return json({
      properties: [],
      payload: {},
    });
  }
};

export default function Property() {
  const { properties, payload } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const size =
    properties?.length > 3 ? "h-without-nav-auto" : "h-without-nav-fixed";

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={`w-full ${size} bg-primary text-white`}>
        <main className="px-4 h-full flex flex-col pt-6">
          <h1 className="text-4xl font-bold text-center pb-4">Properties</h1>
          <div className="properties-list w-full flex flex-col gap-4 pb-4">
            {properties?.map((property) => (
              <PropertyCard
                key={property?.id}
                {...(property as BasicPropertyData)}
              />
            ))}
            {properties?.length === 0 && (
              <div className="text-center text-xl font-bold">
                No properties to display
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
