import { Input } from "@nextui-org/react";

export type HiddenFields = {
  zpid: string;
  parcelId: string;
  lotAreaUnits: string;
  livingAreaUnits: string;
  latitude: string;
  longitude: string;
  homeType: string;
  timestamp: string;
  tax: string;
  annualHomeownersInsurance: string;
  zillowLink: string;
  garage: string;
};

type Props = {
  hiddenFields: HiddenFields;
};

const HiddenPropertyFields = ({ hiddenFields }: Props) => {
  return (
    <>
      {(Object.keys(hiddenFields) as Array<keyof HiddenFields>).map(
        (value, index) => (
          <Input
            key={`hidden-${index}`}
            type="text"
            className="hidden"
            name={value}
            value={hiddenFields[value]}
            readOnly
          />
        )
      )}
    </>
  );
};

export default HiddenPropertyFields;
