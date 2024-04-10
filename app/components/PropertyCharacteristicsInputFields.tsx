import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { ChangeEvent } from "react";
import { HomeTypeEnum } from "~/models/property.zod";
import { separateAndCapitalize } from "~/utils/separateAndCapitalize";

export type HomeType =
  | "Single Family"
  | "Multi Family"
  | "Condo"
  | "Townhouse"
  | "Mobile Home"
  | "Land"
  | "Other";

const homeTypeMap = {
  "Single Family": "SINGLE_FAMILY",
  "Multi Family": "MULTI_FAMILY",
  Condo: "CONDO",
  Townhouse: "TOWNHOUSE",
  "Mobile Home": "MOBILE_HOME",
  Land: "LAND",
  Other: "OTHER",
};

const reverseHomeTypeMap = {
  SINGLE_FAMILY: "Single Family",
  MULTI_FAMILY: "Multi Family",
  CONDO: "Condo",
  TOWNHOUSE: "Townhouse",
  MOBILE_HOME: "Mobile Home",
  LAND: "Land",
  OTHER: "Other",
};

export type PropertyCharacteristics = {
  bedrooms: number;
  bathrooms: number;
  description: string;
  lotSize: number;
  livingArea: number;
  yearBuilt: number;
  purchaseMethod: string;
  price: number;
  garage: number;
  longitude?: number;
  latitude?: number;
  homeType?: HomeTypeEnum;
};

type Props = {
  data: PropertyCharacteristics;
  setProperty: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  orderOfInputs?: Array<keyof PropertyCharacteristics>;
};

const PropertyCharacteristicsInputFields = ({
  data,
  setProperty,
  orderOfInputs = [
    "bedrooms",
    "bathrooms",
    "purchaseMethod",
    "description",
    "lotSize",
    "livingArea",
    "yearBuilt",
    "garage",
    "price",
    "longitude",
    "latitude",
    "homeType",
  ],
}: Props) => {
  const inputs = orderOfInputs.map((value, index) => {
    const { purchaseMethod } = data;
    const InputElement =
      value === "description" ? (
        <Textarea
          label={separateAndCapitalize(value)}
          className="rounded-sm text-secondary text-xs"
          aria-label={separateAndCapitalize(value)}
          rows={10}
          name={value}
          id={value}
          value={data[value]}
          onChange={(e) => setProperty(e)}
        />
      ) : value === "purchaseMethod" ? (
        <Select
          selectionMode="single"
          placeholder="Select an option"
          label="Purchase Method"
          name="purchaseMethod"
          defaultSelectedKeys={[purchaseMethod]}
          className="rounded-sm text-secondary"
          id="purchaseMethod"
          onChange={(e) => setProperty(e)}
        >
          <SelectItem value="rent" key="rent">
            Rent
          </SelectItem>
          <SelectItem value="sell" key="sell">
            Sell
          </SelectItem>
        </Select>
      ) : (
        <Input
          label={
            value === "price"
              ? purchaseMethod === "rent"
                ? "Rent"
                : "Price"
              : separateAndCapitalize(value)
          }
          type="text"
          name={value}
          id={value}
          value={data[value] as string}
          className="rounded-sm  text-secondary"
          onChange={(e) => setProperty(e)}
        />
      );

    return (
      <div
        className={"input-row mb-4".concat(
          value === "description" ||
            value === "price" ||
            value === "purchaseMethod" ||
            value === "homeType"
            ? " w-[100%] flex-grow"
            : " w-[48%] flex-shrink"
        )}
        key={`propertycharacteristics-${index}`}
      >
        {InputElement}
      </div>
    );
  });

  return <div className="flex flex-wrap justify-between">{inputs}</div>;
};

export default PropertyCharacteristicsInputFields;
