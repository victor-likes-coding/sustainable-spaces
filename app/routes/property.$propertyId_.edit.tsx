// import { Form, Link } from "@remix-run/react";

import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import EditPropertyForm from "~/components/EditPropertyForm";
import { ImageService } from "~/models/Image";
import { PropertyService } from "~/models/property";
import { PropertyDataStructure } from "~/models/property.zod";
import { editFormPermissionSelect } from "~/types/property.select";
import { UnauthorizedMutationRequestError } from "~/utils/errors";
import { getFormData } from "~/utils/getFormData";
import { validatePropertyOwner } from "~/utils/helper";

// import Button from "~/components/button";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await getFormData(request);

  const files = formData.getAll("file"); // these are the new images to upload

  // const imageUrls = await uploadImages(files);

  const data = formData.get("data");

  if (!data) {
    throw Error("No data found in form");
  }

  const parsedData = PropertyService.transformToPropertyData(data as string);
  // validate data
  // flatten the data

  const property = await PropertyService.updateProperty(propertyData);
  ImageService.deactivateImages(images);

  return "";
};
76;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  let property: Partial<PropertyDataStructure> = {};
  try {
    const { property: validatedProperty } = await validatePropertyOwner(
      params,
      request,
      editFormPermissionSelect
    );
    property = validatedProperty;
  } catch (err) {
    if (err instanceof UnauthorizedMutationRequestError) {
      throw redirect(`/property/${params.propertyId}?error=unauthorized`);
    }
  }

  return json(property);
};

export default function Property() {
  const property: PropertyDataStructure = useLoaderData<typeof loader>();
  // remove tenantId, zpid, likes, likesCount, updated, created,

  const [propertyData, setPropertyData] =
    useState<PropertyDataStructure>(property);

  // show images
  // show button next to it to add photos
  // each image will have an x on it to be removed from list of images
  // image dele te should only be finallized after the form is submitted
  // if user attaches a new image set the image like how we did in the add form
  // except this time we can preview the image before uploading it
  // final changes are processed once saved

  return (
    <div className="w-full h-without-nav-auto bg-custom-primary text-white">
      <main className="px-4 h-full flex flex-col pt-6">
        <EditPropertyForm
          property={propertyData}
          method="post"
          setProperty={setPropertyData}
        />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        ¬<h1>Oh no!</h1>
        <p>Something went wrong.</p>
        <Scripts />
      </body>
    </html>
  );
}
