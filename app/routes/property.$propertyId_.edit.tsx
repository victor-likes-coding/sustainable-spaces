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
import invariant from "invariant";
import { useState } from "react";
import EditPropertyForm from "~/components/EditPropertyForm";
import { ImageService } from "~/models/Image";
import { PropertyServiceNew, PropertyWithImages } from "~/types/property.new";
import {
  editFormPermissionSelect,
  withPropertyOwnerSelect,
} from "~/types/property.select";
import { UnauthorizedMutationRequestError } from "~/utils/errors";
import { getFormData } from "~/utils/getFormData";
import { validatePropertyOwner } from "~/utils/helper";
import { uploadImages } from "~/utils/storage.server";

// import Button from "~/components/button";

interface RetentionErrors {
  message: string;
  domain: string;
  reason: string;
}

interface RetentionPolicyError {
  code: number;
  message: string;
  errors: RetentionErrors[];
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.propertyId, "No property id found in params");
  await validatePropertyOwner(params, request, withPropertyOwnerSelect); // validates the property owner
  const formData = await getFormData(request);
  let errors = "";

  const files = formData.getAll("files"); // these are the new images to upload

  if (files?.length > 0) {
    try {
      const imageUrls = await uploadImages(files);
      ImageService.addImageUrls(parseInt(params.propertyId), imageUrls);
    } catch (e) {
      const error = e as RetentionPolicyError;
      if (
        error.code === 304 &&
        error.errors.some((err) => err.reason === "retentionPolicyNotMet")
      ) {
        errors += `duplicateImageError=retentionPolicyNotMet`;
      } else {
        console.error(e);
        errors += `error=uploadError`;
      }
    }
  }

  const data = formData.get("data");

  if (!data) {
    throw Error("No data found in form");
  }

  const { images, ...parsedData } = PropertyServiceNew.transformToPropertyData(
    data as string
  );
  ImageService.deactivateImages(images);

  const propertyData = {
    id: parseInt(params.propertyId),
    ...parsedData,
  };
  try {
    await PropertyServiceNew.updateProperty(propertyData);
    return redirect(`/property/${params.propertyId}?${errors}`);
  } catch (e) {
    throw Error("Failed to update property");
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const { property } = await validatePropertyOwner(
      params,
      request,
      editFormPermissionSelect
    );
    return json(property);
  } catch (err) {
    if (err instanceof UnauthorizedMutationRequestError) {
      return redirect(`/property/${params.propertyId}?error=unauthorized`);
    }

    throw err;
  }
};

export default function EditProperty() {
  const property = useLoaderData<typeof loader>();
  // remove tenantId, zpid, likes, likesCount, updated, created,

  const [propertyData, setPropertyData] = useState(
    property as unknown as PropertyWithImages
  );

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
