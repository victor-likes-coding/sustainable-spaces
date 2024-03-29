// import { Form, Link } from "@remix-run/react";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { validatePropertyOwner } from "~/utils/helper";

// import Button from "~/components/button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    await validatePropertyOwner(params, request);
  } catch (err) {
    if (err instanceof UnauthorizedMutationRequestError) {
      console.log("redirecting");
      throw redirect(`/property/${params.propertyId}?error=unauthorized`);
    }
  }

  const { property } = await validateAndRetrieveProperty(params, request);

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
