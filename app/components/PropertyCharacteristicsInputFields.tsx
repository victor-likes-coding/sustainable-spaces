import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { ChangeEvent } from "react";
import { separateAndCapitalize } from "~/utils/helper";

export type PropertyCharacteristics = {
  bedrooms: string;
  bathrooms: string;
  description: string;
  lotSize: string;
  livingArea: string;
  yearBuilt: string;
  purchaseMethod: string;
  price: string;
};

type Props = {
  data: PropertyCharacteristics;
  setProperty: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

const PropertyCharacteristicsInputFields = ({ data, setProperty }: Props) => {
  const inputs = (
    Object.keys(data) as Array<keyof PropertyCharacteristics>
  ).map((value, index) => {
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
          defaultSelectedKeys={["sell"]}
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
          value={data[value]}
          className="rounded-sm  text-secondary"
          onChange={(e) => setProperty(e)}
        />
      );

    return (
      <div
        className={"input-row mb-4".concat(
          value === "description" || value === "price"
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
