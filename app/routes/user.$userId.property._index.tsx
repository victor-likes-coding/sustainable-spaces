import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { PropertyServiceNew } from "~/types/property.new";

export async function loader({ params }: LoaderFunctionArgs) {
  // this portion of the route handles fetching the the properties owned by user
  invariant(params.userId, "User ID is required");
  let ownerId, properties;
  try {
    ownerId = parseFloat(params.userId);
  } catch (e) {
    throw redirect("/getting-started?error=invalid-user-id");
  }

  try {
    properties = await PropertyServiceNew.getPropertiesByOwnerId(ownerId);
  } catch (e) {
    throw redirect("/getting-started?error=property-fetch-error");
  }

  return json({ properties });
}

export default function Index() {
  const { properties } = useLoaderData<typeof loader>();
  return <></>;
}
