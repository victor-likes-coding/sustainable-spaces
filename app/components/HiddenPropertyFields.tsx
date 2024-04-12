import { Input } from "@nextui-org/react";
import { RequiredHiddenPropertyData } from "~/types/property.new";

type Props = {
  hiddenFields: RequiredHiddenPropertyData;
};

const HiddenPropertyFields = ({ hiddenFields }: Props) => {
  console.log(hiddenFields);
  return (
    <>
      {(
        Object.keys(hiddenFields) as Array<keyof RequiredHiddenPropertyData>
      ).map((value, index) => (
        <Input
          key={`hidden-${index}`}
          type="text"
          className="hidden"
          name={value}
          value={hiddenFields[value]?.toString()} // Convert the value to string
          readOnly
        />
      ))}
    </>
  );
};

export default HiddenPropertyFields;
