import { useState } from "react";
import { useSwipeable } from "react-swipeable";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import invariant from "invariant";
import { useLoaderData } from "@remix-run/react";
import PurchaseTag from "~/components/purchase-tag";
import Pill from "~/components/pill";

// import Button from "~/components/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.propertyId, "Property ID is required");
  const property = await db.property.findUnique({
    where: { id: parseFloat(params.propertyId as string) },
  });

  if (!property) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(property);
};

export default function Property() {
  const {
    // id,
    address,
    city,
    state,
    zip,
    price,
    beds,
    baths,
    sqft,
    allowRentOption,
    // description,
    tax,
    insurance,
    hoa,
  } = useLoaderData<typeof loader>();
  const [showContent, setShowContent] = useState(false);
  const handler = useSwipeable({
    onSwipedUp: (eventData) => {
      eventData.velocity > 0.25 ? setShowContent(true) : setShowContent(false);
    },
    onSwipedDown: (eventData) => {
      eventData.velocity > 0.5 ? setShowContent(false) : setShowContent(true);
    },
  });

  return (
    <div className="w-screen h-screen bg-white relative z-10 top-0 left-0 overflow-y-hidden">
      <div
        className={`images-wrapper w-full transition-all duration-300 ease-in-out ${
          showContent ? "h-0" : "h-[66%]"
        } relative z-20 top-0 left-0 scroll-smooth`}
      ></div>

      <Pill showContent={showContent} handler={handler} />
      <div
        {...handler}
        className={`swipeable-container w-full overflow-y-scroll relative z-30 bottom-0 left-0 transition-transform duration-300 transform ${
          showContent ? "-translate-y-0 h-auto" : "translate-y-[0] h-[34%] pb-8"
        }`}
      >
        <div className="w-full">
          <div className="padded-wrapper px-2 flex flex-col gap-1 pb-2">
            <section className="address-row text-xl font-bold">
              {address}, {city}, {state} {zip}
            </section>
            <section className="info-row flex justify-between">
              <div>
                {beds} beds | {baths} baths | {sqft} sqft
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
            <section className="purchase-options-row flex">
              <PurchaseTag text="For Sale" canRent={false} />
              {allowRentOption && (
                <PurchaseTag text="For Rent" canRent={allowRentOption} />
              )}
            </section>
          </div>

          <div className="padded-wrapper px-2 flex flex-col divide-y gap-2">
            <div className="description-row">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              ipsam, voluptatem aliquam nulla est sint dolorum quasi provident
              dolorem quam optio, asperiores cupiditate eum nihil delectus
              labore, accusantium maiores saepe! Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Illum, blanditiis repellat veritatis
              asperiores tempora iure incidunt tempore nesciunt dolor, eius
              iusto sapiente? Dolores quidem eligendi laborum harum enim id
              eveniet, sunt deleniti illo ducimus ab magni? Quas omnis assumenda
              porro odio atque aperiam laborum fugit voluptatem numquam autem
              culpa, obcaecati consectetur, ut nemo dignissimos totam tempora
              qui pariatur rerum adipisci harum impedit sunt ipsam voluptates.
              Aliquid ab iusto recusandae voluptate saepe, assumenda excepturi,
              exercitationem porro autem repellat suscipit quod quisquam!
            </div>
            <section className="financial-row text-center py-2">
              <h2 className="font-semibold mb-2 text-xl">
                Financial & Public Data
              </h2>
              <div className="flex flex-col gap-1 divide-y px-[10%]">
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
                    {(insurance / 12)
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
                    {(hoa / 12)
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                      .replace(/\.\d+/, "")}
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
