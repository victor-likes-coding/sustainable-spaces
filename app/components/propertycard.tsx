import { Link } from "@remix-run/react";
import { BasicPropertyData } from "~/models/property";

const PropertyCard = (property: BasicPropertyData) => {
  const { address, city, state, zip, price, beds, baths, sqft, id } = property;
  return (
    <div className="card-container w-full h-auto bg-white text-sm text-black rounded-md border-secondary relative">
      <div className="card-image-wrapper w-full border-b h-48"></div>
      <div className="card-content w-full px-2">
        <div className="card-title w-full flex justify-between pt-1">
          <div className="left">
            {address}, {city}, {state}, {zip}
          </div>
          <div className="right font-semibold">
            {price
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
              .replace(/\.\d+/, "")}
          </div>
        </div>
        <Link to={{ pathname: `/property/${id}` }}>
          <div className="card-description w-full h-8 flex justify-between items-center">
            <div className="left">
              {beds} beds | {baths} baths | {sqft} sqft
            </div>
          </div>
        </Link>
        <Link
          to={{ pathname: `/property/${id}/bid` }}
          className="absolute bottom-2 right-2 px-8 bg-green-700 text-white rounded-md"
        >
          Bid
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
