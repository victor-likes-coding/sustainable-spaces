import { Image } from "@nextui-org/react";
import { Link, useNavigation } from "@remix-run/react";
import Loader from "./Loader";
import { PropertyWithImages } from "~/types/property.new";

type Props = {
  property: PropertyWithImages | null;
};

const PropertyCard = ({ property }: Props) => {
  const navigate = useNavigation();
  if (!property) {
    return null;
  }

  const {
    id,
    streetAddress,
    state,
    price,
    bedrooms,
    bathrooms,
    livingArea,
    images,
  } = property;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <>
      <Link
        to={`/property/${id}`}
        className="card-container w-full h-auto text-sm rounded-md border-secondary relative z-0 text-white cursor-pointer"
      >
        <div className="card-image-wrapper w-full pb-2">
          <Image
            src={
              images && images.length > 0
                ? images[0].url
                : "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
            }
          />
        </div>
        <div className="card-content w-full px-2">
          <div className="card-title w-full flex justify-between pt-1 pr-3">
            <div className="left font-bold">
              {streetAddress} | {state}
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
          <div className="card-description w-full h-8 flex justify-between items-center">
            <div className="left text-xs">
              {bedrooms} beds • {bathrooms} baths • {livingArea} sqft
            </div>
          </div>
          <Link
            onClick={(e) => e.stopPropagation()}
            to={{ pathname: `/property/${id}/bid` }}
            className="absolute bottom-2 right-2 px-8 bg-green-700 text-white rounded-md"
          >
            Bid
          </Link>
        </div>
      </Link>
      {navigate.state === "loading" && (
        <Loader
          labelColor="success"
          color="success"
          text="Navigating to property"
        />
      )}
    </>
  );
};

export default PropertyCard;
