// import { Form, Link } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import Navbar from "~/components/navbar";
import PropertyCard from "~/components/propertycard";
import { PropertyServiceNew, PropertyWithImages } from "~/types/property.new";
// import { TokenPayload, getLoggedInStatus } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";

// import Button from "~/components/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = await requireToken(request);
  const properties = await PropertyServiceNew.getProperties();

  return json({
    properties,
    payload,
  });
};

export default function PropertyIndex() {
  const { properties } = useLoaderData<typeof loader>();
  // const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const size = properties?.length >= 3 ? "h-without-nav-auto" : "h-screen";

  return (
    <>
      {/* <Navbar isLoggedIn={isLoggedIn} /> */}
      <div className={`w-full ${size} bg-custom-primary text-white`}>
        <main className=" h-full flex flex-col pt-3">
          {/* property card container */}
          <div className="properties-list w-full flex flex-col gap-4 pb-4 px-3">
            {properties?.map((property) => {
              return (
                <PropertyCard
                  key={property.id}
                  property={property as unknown as PropertyWithImages}
                  // ! TODO - FIX unknown conversion / figure out JsonifyObject<T>
                />
              );
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
