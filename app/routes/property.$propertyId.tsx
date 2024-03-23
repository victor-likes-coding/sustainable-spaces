import { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "invariant";
import { Link, useLoaderData } from "@remix-run/react";
import PurchaseTag from "~/components/purchase-tag";
import EditSVG from "~/components/svg/Edit";
import Pill from "~/components/pill";
import { DatabaseProperty, PropertyService } from "~/models/property";
import { requireToken } from "~/utils/sessions.server";

// import Button from "~/components/button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const payload = requireToken(request);
  invariant(params.propertyId, "Property ID is required");
  const id = parseFloat(params.propertyId as string);
  const property = await PropertyService.getProperty(id);

  if (!property) {
    throw new Response("Not Found", { status: 404 });
  }

  const databaseProperty = new DatabaseProperty(property);

  return json({ databaseProperty, payload });
};

export default function Property() {
  const {
    databaseProperty: {
      id,
      address: { streetAddress, city, state, zipcode },
      bedrooms,
      bathrooms,
      livingArea,
      price,
      purchaseMethod,
      description,
      tax,
      annualHomeownersInsurance,
      fees: { hoa },
      ownerId,
      images,
    },
    payload,
  } = useLoaderData<typeof loader>();
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
  const focusRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-screen h-auto bg-white relative z-10 top-0 left-0 overflow-y-scroll">
      <div
        className={`images-wrapper w-full transition-all duration-300 ease-in-out ${
          showContent ? "h-0 hidden" : "h-[66%]"
        } relative z-20 top-0 left-0 scroll-smooth`}
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

      <div
        {...handler}
        className={`swipeable-container w-full relative z-30 bottom-0 left-0 transition-transform duration-300 transform pb-3 ${
          showContent ? "-translate-y-0 h-full" : "translate-y-[55vh] h-[34%] "
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
              <Link
                to={`/properties/${id}/edit`}
                className="absolute right-0 top-0"
              >
                <EditSVG size={1.5} />
              </Link>
              <br />
              {city}, {state}, {zipcode}
            </section>
            <section className="info-row flex flex-col-reverse">
              <div className="text-sm">
                {bedrooms} beds | {bathrooms} baths | {livingArea} sqft
              </div>
              <div className="font-bold">
                {price
                  .toLocaleString("en-US", {
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
                    {(tax / 12)
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
                    {(annualHomeownersInsurance / 12)
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
                    {(hoa ? hoa / 12 : 0)
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
  );
}
