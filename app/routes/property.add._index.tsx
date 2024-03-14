// import { Form, Link } from "@remix-run/react";

import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import Navbar from "~/components/navbar";
import {
  AdditionalMutationData,
  TokenPayload,
  ZillowPropertyData,
  createZillowUrl,
  getLoggedInStatus,
} from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import invariant from "invariant";
import { useCallback, useMemo, useRef, useState } from "react";
import { PropertyNotFoundError } from "~/utils/errors";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Loader from "~/components/Loader";
import { MutationSafePropertyData, PropertyService } from "~/models/property";

type Library =
  | "core"
  | "maps"
  | "places"
  | "geocoding"
  | "routes"
  | "marker"
  | "geometry"
  | "elevation"
  | "streetView"
  | "journeySharing"
  | "drawing"
  | "visualization";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  invariant(
    process.env.REACT_APP_GOOGLE_MAPS_API,
    "REACT_APP_GOOGLE_MAPS_API is not defined"
  );
  try {
    const payload = await requireToken(request);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;
    return json({
      payload,
      apiKey,
    });

export async function action({ request }: ActionFunctionArgs) {
  const payload = (await requireToken(request)) as TokenPayload;
  const clonedRequest = request.clone(); // fixes locking up the readable stream for the request object
  const formData = await clonedRequest.formData(); // ! flattens our form data :)

  const data = Object.fromEntries(formData);
  PropertyService.createProperty({
    ...data,
    ownerId: payload.id,
  } as MutationSafePropertyData);

  return json({});
}

export default function Index() {
  const { payload, apiKey } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadScriptRef = useRef(null);
  const libraries: Library[] = useMemo(() => ["places"], []);
  const [property, setProperty] = useState<
    ZillowPropertyData & AdditionalMutationData
  >({
    zpid: 0,
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
    },
    bedrooms: 0,
    bathrooms: 0,
    description: "",
    lotSize: 0,
    livingArea: 0,
    yearBuilt: 0,
    purchaseMethod: "rent",
    price: 0,
    homeType: "",
    latitude: 0,
    longitude: 0,
    livingAreaUnits: "",
    lotAreaUnits: "",
    tax: 0,
    annualHomeownersInsurance: 0,
    zillowLink: "",
    garage: 0,
    parcelId: "",
  });
  const submit = useSubmit();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [errors, setErrors] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    lotSize: "",
    livingArea: "",
    yearBuilt: "",
    price: "",
    generic: "",
  });

  const [isLoading, setIsLoading] = useState(false); // only meant for handlePlaceChanged

  const handlePlaceChanged = useCallback(async () => {
    const place = inputRef.current?.value;
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
      const { propertyData } = await serverResponse.json();
      if (!propertyData) throw new PropertyNotFoundError();

      setProperty((prevProperty) => ({
        ...prevProperty,
        ...propertyData,
      }));
    } catch (err) {
      if (err instanceof PropertyNotFoundError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          generic: err.message,
        }));

        onOpen(); // open modal
        return;
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={`w-full h-without-nav-auto bg-primary text-white`}>
        <main className="px-4 h-full flex flex-col pt-6">
          <h1 className="text-4xl font-bold text-center pb-4">Add Property</h1>
          <div className="w-full">
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={libraries}
              ref={loadScriptRef}
            >
              <Autocomplete
                className="text-black"
                onLoad={() => {
                  return;
                }}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a location"
                  className="w-full border-2 border-gray-300 rounded-md p-2"
                />
              </Autocomplete>
            </LoadScript>

            <Form
              method="post"
              onSubmit={() => {
                submit(
                  { ...property },
                  { method: "post", encType: "application/json" }
                );
              }}
              className="flex flex-col gap-2 mt-4 text-black"
            >
              <div className="input-group w-full flex flex-col">
                <label htmlFor="streetAddress" className="text-sm">
                  Street Address
                </label>
                <input
                  id="streetAddress"
                  type="text"
                  name="streetAddress"
                  className="rounded-sm pl-2 text-secondary"
                  value={property?.address.streetAddress}
                  onChange={(e) => {
                    setProperty((prevProperty) => ({
                      ...prevProperty,
                      address: {
                        ...prevProperty.address,
                        streetAddress: e.target.value,
                      },
                    }));
                  }}
                />
              </div>
              <div className="input-group flex flex-col w-full grow">
                <label htmlFor="city" className="text-sm">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={property?.address.city}
                  className="rounded-sm pl-2 text-secondary"
                  onChange={(e) =>
                    setProperty((prevProperty) => ({
                      ...prevProperty,
                      address: {
                        ...prevProperty.address,
                        city: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex justify-between">
                <div className="input-group flex flex-col w-[34%]">
                  <label htmlFor="state" className="text-sm">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={property?.address.state}
                    className="rounded-sm pl-2 text-secondary"
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        address: {
                          ...prevProperty.address,
                          state: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div className="input-group flex flex-col">
                  <label htmlFor="zipcode" className="text-sm">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    className="rounded-sm pl-2 text-secondary"
                    id="zipcode"
                    value={property?.address.zipcode}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        address: {
                          ...prevProperty.address,
                          zipcode: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="bedrooms" className="text-sm">
                    Bedrooms
                  </label>

                  <input
                    type="text"
                    name="bedrooms"
                    className="rounded-sm pl-2 text-secondary"
                    id="bedrooms"
                    value={property?.bedrooms}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        bedrooms: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="bathrooms" className="text-sm">
                    Bathrooms
                  </label>
                  <input
                    type="text"
                    name="bathrooms"
                    className="rounded-sm pl-2 text-secondary"
                    id="bathrooms"
                    value={property?.bathrooms}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        bathrooms: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="input-group w-full flex flex-col">
                <label htmlFor="description" className="text-sm">
                  Description
                </label>
                <textarea
                  className="rounded-sm text-secondary text-xs p-1"
                  rows={10}
                  name="description"
                  id="description"
                  value={property?.description}
                  onChange={(e) =>
                    setProperty((prevProperty) => ({
                      ...prevProperty,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-between">
                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="lotSize" className="text-sm">
                    Lot Size (sqft)
                  </label>

                  <input
                    type="text"
                    name="lotSize"
                    className="rounded-sm pl-2 text-secondary"
                    id="lotSize"
                    value={property?.lotSize}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        lotSize: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="livingArea" className="text-sm">
                    Living Area (sqft)
                  </label>
                  <input
                    type="text"
                    name="livingArea"
                    className="rounded-sm pl-2 text-secondary"
                    id="livingArea"
                    value={property?.livingArea}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        livingArea: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="yearBuilt" className="text-sm">
                    Year Built
                  </label>
                  <input
                    type="text"
                    name="yearBuilt"
                    className="rounded-sm pl-2 text-secondary"
                    id="yearBuilt"
                    value={property?.yearBuilt}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        yearBuilt: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="input-group w-[48%] flex flex-col">
                  <label htmlFor="purchaseMethod" className="text-sm">
                    Purchase Method
                  </label>
                  <select
                    name="purchaseMethod"
                    className="rounded-sm pl-1 text-secondary"
                    id="purchaseMethod"
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        purchaseMethod: e.target.value as "rent" | "sell",
                      }))
                    }
                  >
                    <option value="rent">Rent</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
              </div>
              <div className="input-group w-full flex flex-col">
                <label htmlFor="price" className="text-sm">
                  {property.purchaseMethod === "rent" ? "Rent" : "Price"}
                </label>
                <input
                  id="price"
                  type="text"
                  name="price"
                  value={property?.price}
                  className="rounded-sm pl-2 text-secondary"
                  onChange={(e) => {
                    setProperty((prevProperty) => ({
                      ...prevProperty,
                      price: parseInt(e.target.value),
                    }));
                  }}
                />
              </div>
              <button
                type="submit"
                className="rounded-sm bg-secondary py-2 text-xs font-bold text-white mt-2 mb-4"
              >
                Add
              </button>
            </Form>
          </div>
        </main>
      </div>
      {isLoading && <Loader />}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ooops, Something went wrong!
              </ModalHeader>
              <ModalBody>
                <p>{errors.generic}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
