import { Link } from "@remix-run/react";
import { PropertyData } from "~/models/property";

const PropertyCard = (property: PropertyData) => {
  const { address, city, state, zip, price, beds, baths, sqft, id } = property;
  return (
    <div className="card-container w-full h-auto bg-white text-sm text-black rounded-md border-secondary">
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
      </div>
    </div>
  );
};

export default PropertyCard;
