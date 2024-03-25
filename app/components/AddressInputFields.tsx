import { Input } from "@nextui-org/react";
import { ChangeEvent } from "react";
import type { AddressData } from "~/models/property";
import { separateAndCapitalize } from "~/utils/helper";

type Props = {
  address: AddressData;
  setProperty: (event: ChangeEvent<HTMLInputElement>) => void;
};

const AddressInputFields = ({ address, setProperty }: Props) => {
  const inputs = (Object.keys(address) as Array<keyof AddressData>).map(
    (value, index) => {
      return (
        <div
          className={"input-row mb-4".concat(
            value === "zipcode" || value === "state"
              ? " flex-shrink w-[48%]"
              : " w-[100%] flex-grow"
          )}
          key={`address-${index}`}
        >
          <Input
            label={separateAndCapitalize(value)}
            type="text"
            name={value}
            id={value}
            value={address[value]}
            className="rounded-sm  text-secondary"
            onChange={(e) => setProperty(e)}
          />
        </div>
      );
    }
  );

  return <div className="flex flex-wrap justify-between">{inputs}</div>;
};

export default AddressInputFields;
