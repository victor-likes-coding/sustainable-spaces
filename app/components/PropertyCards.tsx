import PropertyCard from "~/components/propertycard";
import { PropertyWithImages } from "~/types/property.new";

interface Props {
  properties: PropertyWithImages[];
  editable?: boolean;
  ownerId?: number;
}

export function PropertyCards({ properties, editable, ownerId }: Props) {
  return (
    <div className="properties-list w-full flex flex-col gap-4 pb-4 px-3">
      {properties?.map((property) => {
        return (
          <PropertyCard
            editable={editable}
            key={property.id}
            isOwner={property.ownerId === ownerId}
            property={property as unknown as PropertyWithImages}
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
