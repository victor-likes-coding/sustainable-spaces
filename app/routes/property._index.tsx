// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import Navbar from "~/components/navbar";
import PropertyCard from "~/components/propertycard";
import {
  DatabaseProperty,
  PropertyData,
  PropertyService,
} from "~/models/property";
// import { TokenPayload, getLoggedInStatus } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";

// import Button from "~/components/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = await requireToken(request);
  const properties: PropertyData[] = await PropertyService.getProperties();
  return json({
    properties,
    payload,
  });
};

export default function Property() {
  const { properties } = useLoaderData<typeof loader>();
  // const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const size =
    properties?.length >= 3 ? "h-without-nav-auto" : "h-without-nav-fixed";

  return (
    <>
      {/* <Navbar isLoggedIn={isLoggedIn} /> */}
      <div className={`w-full ${size} bg-primary text-white`}>
        <main className=" h-full flex flex-col pt-3">
          {/* property card container */}
          <div className="properties-list w-full flex flex-col gap-4 pb-4 px-3">
            {properties?.map((property) => {
              const currentProperty = new DatabaseProperty(property);
              return <PropertyCard key={property?.id} {...currentProperty} />;
            })}
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
