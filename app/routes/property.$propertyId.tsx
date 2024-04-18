import { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PurchaseTag from "~/components/purchase-tag";
import EditSVG from "~/components/svg/Edit";
import Pill from "~/components/pill";
import { TokenPayload, validateAndRetrieveProperty } from "~/utils/helper";
import useModal from "~/components/Modal";
import { singlePropertyDefaultWithImage } from "~/types/property.select";
import { DatabaseProperty } from "~/models/property";
// import Button from "~/components/button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const {
    property,
    payload,
  }: { property: DatabaseProperty; payload: TokenPayload } =
    await validateAndRetrieveProperty(
      params,
      request,
      singlePropertyDefaultWithImage
    );
  const error = new URL(request.url).searchParams.get("error");

  return json({ property, payload, error });
};

export default function Property() {
  const {
    property: {
      id,
      images,
      address: { streetAddress, city, state, zipcode },
      fees: { hoa },
      bedrooms,
      bathrooms,
      livingArea,
      price,
      purchaseMethod,
      description,
      ownerId,
      tax,
      annualHomeownersInsurance,
    },
    payload: { id: userId },
    error,
  } = useLoaderData<typeof loader>();

  const { renderModal, onOpen, setKey, errors } = useModal({
    errors: {
      unauthorized: "You are not authorized to edit this property",
    },
  });

  const [showContent, setShowContent] = useState(false);
  const handler = useSwipeable({
    onSwipedUp: (eventData) => {
      eventData.velocity > 0.15 ? setShowContent(true) : setShowContent(false);
    },
    onSwipedDown: (eventData) => {
      eventData.velocity > 0.15 ? setShowContent(false) : setShowContent(true);
    },
    onSwiped: () => {
      focusRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });

  const modal = renderModal();
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      setKey(error as keyof typeof errors);
      onOpen();
    }
  }, [error, onOpen, setKey]);

  const height = (
    (images.length >= 0 && images.length < 4 ? images.length || 1 : 3) * 200
  )
    .toString()
    .concat("px");

  return (
    <>
      <div className="w-screen h-screen bg-white relative z-10 top-0 left-0 overflow-y-scroll">
        {
          <div
            className={`images-wrapper w-full transition-all duration-300 ease-in-out max-h-[600px] ${
              showContent ? "h-0 hidden" : ` h-[${height}]`
            } relative z-20 top-0 left-0 scroll-smooth overflow-y-scroll`}
          >
            {images &&
              images.length > 0 &&
              images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ))}
          </div>
        }

        <div
          {...handler}
          className={`swipeable-container w-full relative z-30 bottom-0 left-0 transition-transform duration-300 transform pb-3 ${
            showContent
              ? "-translate-y-0 h-full"
              : `translate-y-[${height}] h-auto `
          }`}
        >
          <Pill showContent={showContent} />
          <div className="w-full px-4 pt-2 divide-y flex flex-col gap-3">
            <div className="padded-wrapper  flex flex-col gap-1 pb-2">
              <section
                className="address-row text-md font-bold relative"
                data-testid="swipeableFocus"
                ref={focusRef}
              >
                {streetAddress}
                {/* // edit button */}
                {ownerId === userId && (
                  <Link
                    to={`/property/${id}/edit`}
                    className="absolute right-0 top-0"
                  >
                    <EditSVG size={1.5} />
                  </Link>
                )}
                <br />
                {city}, {state}, {zipcode}
              </section>
              <section className="info-row flex flex-col-reverse">
                <div className="text-sm">
                  {bedrooms} beds | {bathrooms} baths | {livingArea} sqft
                </div>
                <div className="font-bold">
                  {(price || 0)
                    ?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                    .replace(/\.\d+/, "")}
                </div>
              </section>
              <section className="purchase-options-row flex gap-3">
                {purchaseMethod === "rent" ? (
                  <PurchaseTag text="For Rent" canRent={true} />
                ) : (
                  <PurchaseTag text="For Sale" canRent={false} />
                )}
              </section>
            </div>

            <div className="description-row pt-3">{description}</div>
            <div className="padded-wrapper flex flex-col gap-2">
              <section className="financial-row text-center py-2">
                <h2 className="font-semibold mb-2 text-xl">
                  Financial & Public Data
                </h2>
                <div className="flex flex-col gap-1 divide-y">
                  <div className="flex justify-between">
                    <div>Property Tax</div>
                    <div className="font-bold">
                      {((tax || 0) / 12)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                        .replace(/\.\d+/, "")}
                      /month
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Home Insurance</div>
                    <div className="font-bold">
                      {((annualHomeownersInsurance || 0) / 12)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                        .replace(/\.\d+/, "")}
                      /month
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>HOA</div>
                    <div className="font-bold">
                      {((hoa || 0) / 12)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                        .replace(/\.\d+/, "")}{" "}
                      /month
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      {modal}
    </>
  );
}
