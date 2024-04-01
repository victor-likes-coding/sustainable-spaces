// import { Form, Link } from "@remix-run/react";

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Navbar from "~/components/navbar";
import {
  AdditionalMutationData,
  TokenPayload,
  ZillowPropertyData,
  createZillowUrl,
} from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import invariant from "invariant";
import { useCallback, useEffect, useState } from "react";
import {
  PropertyAlreadyExistsError,
  PropertyNotFoundError,
  ZillowCaptchaError,
} from "~/utils/errors";
import Loader from "~/components/Loader";
import { PropertyFormData, PropertyService } from "~/models/property";
import PlacesSearch from "~/components/PlacesSearch";
import AddPropertyForm from "~/components/AddPropertyForm";
import { uploadImages } from "~/utils/storage.server";
import { ImageService } from "~/models/Image";
import { MutationSafePropertyData } from "~/models/property.zod";
import useModal from "~/components/Modal";
import { getLoggedInStatus } from "~/utils/getLoggedInStatus";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  invariant(
    process.env.REACT_APP_GOOGLE_MAPS_API,
    "REACT_APP_GOOGLE_MAPS_API is not defined"
  );
  const payload = await requireToken(request);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;
  return json({
    payload: payload as TokenPayload,
    apiKey,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const payload = (await requireToken(request)) as TokenPayload;
  const clonedRequest = request.clone(); // fixes locking up the readable stream for the request object
  const formData = await clonedRequest.formData();

  // get image files
  const files = formData.getAll("files");
  const imageUrls: string[] = await uploadImages(files);

  const { data } = Object.fromEntries(formData);
  // property is a string, so we need to parse it
  const { address, ...rest }: Partial<ZillowPropertyData> = JSON.parse(
    data as string
  );

  // shape into flat data
  const flatData = {
    ...address,
    ...rest,
  } as MutationSafePropertyData;

  const { id } = await PropertyService.createProperty({
    ...flatData,
    ownerId: payload.id,
  } as MutationSafePropertyData);

  // save image url to database with coinciding with property id
  if (imageUrls.length > 0) await ImageService.addImageUrls(id, imageUrls);

  return redirect(`/property/${id}`);
}

export type FormDataType = PropertyFormData & AdditionalMutationData;

export default function Index() {
  const { payload, apiKey } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const [isLoading, setIsLoading] = useState(false); // only meant for handlePlaceChanged
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout>();
  const { renderModal, onOpen, setErrors, setKey } = useModal({
    errors: {
      address: "",
      bedrooms: "",
      bathrooms: "",
      description: "",
      lotSize: "",
      livingArea: "",
      yearBuilt: "",
      price: "",
      generic: "",
    },
  });
  const navigate = useNavigate();
  const emptyProperty: FormDataType = PropertyService.createEmptyProperty();

  const [property, setProperty] = useState<FormDataType>(emptyProperty);

  useEffect(() => {
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  const handlePlaceChanged = useCallback(async (place: string | undefined) => {
    let jsonPayload: {
      error?: string;
      propertyId?: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propertyData?: any; // ! TODO: place proper data type
    };
    if (!place) return;

    try {
      setIsLoading(true);
      const serverResponse = await fetch("/getZillowData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: createZillowUrl(place), address: place }),
      });
      jsonPayload = await serverResponse.json();
      if (jsonPayload.error === "PropertyAlreadyExistsError")
        throw new PropertyAlreadyExistsError();

      const { propertyData } = jsonPayload;

      if (!propertyData) throw new PropertyNotFoundError();

      setProperty((prevProperty) => ({
        ...prevProperty,
        ...propertyData,
      }));
    } catch (err) {
      if (
        err instanceof PropertyNotFoundError ||
        err instanceof PropertyAlreadyExistsError ||
        err instanceof ZillowCaptchaError
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          generic: err.message,
        }));

        setKey("generic");
      }

      onOpen(); // open modal
      if (err instanceof PropertyAlreadyExistsError) {
        const timeoutId = setTimeout(() => {
          navigate(`/property/${jsonPayload.propertyId}`);
        }, 3000);
        setRedirectTimer(timeoutId);
      }
      return;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modal = renderModal();

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={`w-full h-without-nav-auto bg-custom-primary text-white`}>
        <main className="h-full flex flex-col pt-6">
          <div className="w-full px-4">
            <PlacesSearch
              apiKey={apiKey}
              handlePlaceChanged={handlePlaceChanged}
            />
            <AddPropertyForm
              method="post"
              setProperty={setProperty}
              property={property}
              className="flex flex-col mt-4 text-black"
            />
          </div>
        </main>
      </div>
      {isLoading && (
        <Loader
          labelColor="success"
          color="success"
          text="Looking up property"
        />
      )}
      {modal}
    </>
  );
}
