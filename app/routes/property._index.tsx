// import { Form, Link } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import Navbar from "~/components/navbar";
import { PropertyServiceNew, PropertyWithImages } from "~/types/property.new";
// import { TokenPayload, getLoggedInStatus } from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import { PropertyCards } from "../components/PropertyCards";

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
  const { properties, payload } = useLoaderData<typeof loader>();
  // const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const size = properties?.length >= 3 ? "h-without-nav-auto" : "h-screen";

  return (
    <>
      <div className={`w-full ${size} bg-custom-primary text-white`}>
        <main className=" h-full flex flex-col pt-3">
          {/* property card container */}
          {
            <PropertyCards
              ownerId={payload?.id}
              properties={properties as unknown as PropertyWithImages[]}
            />
          }
        </main>
      </div>
    </>
  );
}
