// import { Form, Link } from "@remix-run/react";

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import Navbar from "~/components/navbar";
import {
  AdditionalMutationData,
  TokenPayload,
  createZillowUrl,
  getLoggedInStatus,
} from "~/utils/helper";
import { requireToken } from "~/utils/sessions.server";
import invariant from "invariant";
import { useCallback, useEffect, useState } from "react";
import {
  PropertyAlreadyExistsError,
  PropertyNotFoundError,
} from "~/utils/errors";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Loader from "~/components/Loader";
import {
  MutationSafePropertyData,
  PropertyService,
  PropertyFormData,
} from "~/models/property";
import Upload from "~/components/Upload";
import PlacesSearch from "~/components/PlacesSearch";

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
  const formData = await clonedRequest.formData(); // ! flattens our form data :)

  const data = Object.fromEntries(formData);
  const property = await PropertyService.createProperty({
    ...data,
    ownerId: payload.id,
  } as MutationSafePropertyData);

  // remove the localPropertyData file

  return redirect(`/property/${property.id}`);
}

export default function Index() {
  const { payload, apiKey } = useLoaderData<typeof loader>();
  const isLoggedIn: boolean = getLoggedInStatus(payload as TokenPayload);
  const [isLoading, setIsLoading] = useState(false); // only meant for handlePlaceChanged
  const [fileData, setFileData] = useState<FileList | null>(null);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [property, setProperty] = useState<
    PropertyFormData & AdditionalMutationData
  >({
    zpid: "0",
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
    },
    bedrooms: "0",
    bathrooms: "0",
    description: "",
    lotSize: "0",
    livingArea: "0",
    yearBuilt: "0",
    purchaseMethod: "rent",
    price: "0",
    homeType: "",
    latitude: "0",
    longitude: "0",
    livingAreaUnits: "",
    lotAreaUnits: "",
    tax: "0",
    annualHomeownersInsurance: "0",
    zillowLink: "",
    garage: "0",
    parcelId: "",
  });

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
      const { propertyData } = jsonPayload;
      if (!propertyData) {
        if (jsonPayload.error === "PropertyAlreadyExistsError") {
          throw new PropertyAlreadyExistsError();
        }
        throw new PropertyNotFoundError();
      }

      setProperty((prevProperty) => ({
        ...prevProperty,
        ...propertyData,
      }));
    } catch (err) {
      if (
        err instanceof PropertyNotFoundError ||
        err instanceof PropertyAlreadyExistsError
      ) {
        console.error(err);
        setErrors((prevErrors) => ({
          ...prevErrors,
          generic: err.message,
        }));
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

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className={`w-full h-without-nav-auto bg-primary text-white`}>
        <main className="h-full flex flex-col pt-6">
          <div className="w-full px-4">
            <PlacesSearch
              apiKey={apiKey}
              handlePlaceChanged={handlePlaceChanged}
            />

            <Form
              method="post"
              encType="multipart/form-data"
              onSubmit={() => {
                submit(
                  { ...property },
                  { method: "post", encType: "application/json" }
                );
              }}
              className="flex flex-col gap-3 mt-4 text-black"
            >
              <div className="input-group w-full flex flex-col">
                <Input
                  label="Street Address"
                  id="streetAddress"
                  type="text"
                  name="streetAddress"
                  className="rounded-sm  text-secondary"
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
                <Input
                  label="City"
                  type="text"
                  name="city"
                  id="city"
                  value={property?.address.city}
                  className="rounded-sm  text-secondary"
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
                  <Input
                    label="State"
                    type="text"
                    name="state"
                    id="state"
                    value={property?.address.state}
                    className="rounded-sm  text-secondary"
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
                  <Input
                    label="Zipcode"
                    type="text"
                    name="zipcode"
                    className="rounded-sm  text-secondary"
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
                  <Input
                    label="Bedrooms"
                    name="bedrooms"
                    className="rounded-sm  text-secondary"
                    id="bedrooms"
                    value={property?.bedrooms}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        bedrooms: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group w-[48%] flex flex-col">
                  <Input
                    label="Bathrooms"
                    type="number"
                    name="bathrooms"
                    className="rounded-sm  text-secondary"
                    id="bathrooms"
                    value={property?.bathrooms}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        bathrooms: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="input-group w-full flex flex-col">
                <Textarea
                  label="Description"
                  className="rounded-sm text-secondary text-xs"
                  aria-label="description"
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
                  <Input
                    type="number"
                    name="lotSize"
                    label="Lot Size (sqft)"
                    className="rounded-sm  text-secondary"
                    id="lotSize"
                    value={property?.lotSize}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        lotSize: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-group w-[48%] flex flex-col">
                  <Input
                    label="Living Area (sqft)"
                    type="number"
                    name="livingArea"
                    className="rounded-sm  text-secondary"
                    id="livingArea"
                    value={property?.livingArea}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        livingArea: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="input-group w-[48%] flex flex-col">
                  <Input
                    label="Year Built"
                    type="number"
                    name="yearBuilt"
                    className="rounded-sm  text-secondary"
                    id="yearBuilt"
                    value={property?.yearBuilt}
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        yearBuilt: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="input-group w-[48%] flex flex-col">
                  <Select
                    selectionMode="single"
                    placeholder="Select an option"
                    label="Purchase Method"
                    name="purchaseMethod"
                    defaultSelectedKeys={["sell"]}
                    className="rounded-sm pl-1 text-secondary"
                    id="purchaseMethod"
                    onChange={(e) =>
                      setProperty((prevProperty) => ({
                        ...prevProperty,
                        purchaseMethod: e.target.value as "rent" | "sell",
                      }))
                    }
                  >
                    <SelectItem value="rent" key="rent">
                      Rent
                    </SelectItem>
                    <SelectItem value="sell" key="sell">
                      Sell
                    </SelectItem>
                  </Select>
                </div>
              </div>
              <div className="input-group w-full flex flex-col">
                <Input
                  label={property.purchaseMethod === "rent" ? "Rent" : "Price"}
                  id="price"
                  name="price"
                  value={property?.price}
                  className="rounded-sm  text-secondary"
                  onChange={(e) => {
                    setProperty((prevProperty) => ({
                      ...prevProperty,
                      price: e.target.value,
                    }));
                  }}
                />
              </div>
              <Input
                type="number"
                className="hidden"
                name="zpid"
                value={property?.zpid}
                readOnly
              />
              <Input
                type="text"
                className="hidden"
                name="homeType"
                value={property?.homeType}
                readOnly
              />
              <Input
                type="number"
                className="hidden"
                name="latitude"
                value={property?.latitude}
                readOnly
              />
              <Input
                type="number"
                className="hidden"
                name="longitude"
                value={property?.longitude}
                readOnly
              />
              <Input
                type="text"
                className="hidden"
                name="livingAreaUnits"
                value={property?.livingAreaUnits}
                readOnly
              />
              <Input
                type="text"
                className="hidden"
                name="lotAreaUnits"
                value={property?.lotAreaUnits}
                readOnly
              />
              <Input
                type="number"
                className="hidden"
                name="tax"
                value={property?.tax}
                readOnly
              />
              <Input
                type="number"
                className="hidden"
                name="annualHomeownersInsurance"
                value={property?.annualHomeownersInsurance}
                readOnly
              />
              <Input
                type="text"
                className="hidden"
                name="zillowLink"
                value={property?.zillowLink}
                readOnly
              />
              <Input
                type="number"
                className="hidden"
                value={property?.garage}
                readOnly
              />
              <Input
                type="text"
                className="hidden"
                name="parcelId"
                value={property?.parcelId}
                readOnly
              />
              <Upload files={fileData} setFiles={setFileData} />
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
      {isLoading && (
        <Loader
          labelColor="success"
          color="success"
          text="Looking up property"
        />
      )}
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
