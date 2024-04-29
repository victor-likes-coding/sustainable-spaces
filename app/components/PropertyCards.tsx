import PropertyCard from "~/components/propertycard";
import { PropertyWithImages } from "~/types/property.new";
import { InfoObject } from "./BidModal";

interface Props {
  properties: PropertyWithImages[];
  editable?: boolean;
  ownerId: number;
  onBidClick: () => void;
  setInfo: (info: InfoObject) => void;
}

export function PropertyCards({
  properties,
  editable,
  ownerId,
  ...rest
}: Props) {
  return (
    <div className="properties-list w-full flex flex-col gap-4 pb-4 px-3">
      {properties?.map((property) => {
        return (
          <PropertyCard
            editable={editable}
            key={property.id}
            isOwner={property.ownerId === ownerId}
            ownerId={ownerId}
            property={property as unknown as PropertyWithImages}
            {...rest}
          />
        );
      })}
      {properties?.length === 0 && (
        <div className="text-center text-xl font-bold">
          No properties to display
        </div>
      )}
    </div>
  );
}
