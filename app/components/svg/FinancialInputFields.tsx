import { Input } from "@nextui-org/react";
import { ChangeEvent } from "react";
import { separateAndCapitalize } from "~/utils/separateAndCapitalize";

type FeeFields = {
  tax: number | undefined;
  annualHomeownersInsurance: number | undefined;
  management: number;
  capex: number;
  vacancy: number;
  hoa?: number | null | undefined;
};

type Props = {
  data: Partial<FeeFields>;
  setProperty: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  orderOfInputs?: Array<keyof FeeFields>;
};

const FinancialInputFields = ({
  data,
  setProperty,
  orderOfInputs = [
    "annualHomeownersInsurance",
    "tax",
    "management",
    "capex",
    "vacancy",
    "hoa",
  ],
}: Props) => {
  const inputs = orderOfInputs.map((value, index) => {
    let InputElement;
    switch (value) {
      default:
        InputElement = (
          <Input
            inputMode={
              value === "tax" || value === "annualHomeownersInsurance"
                ? "numeric"
                : "decimal"
            }
            label={
              value === "hoa"
                ? "HOA"
                : value === "annualHomeownersInsurance"
                ? "Insurance"
                : separateAndCapitalize(value)
            }
            type=""
            name={value}
            id={value}
            value={data[value]?.toString() ?? "0"}
            className="rounded-sm  text-secondary"
            onChange={(e) => setProperty(e)}
          />
        );
    }
    return (
      <div
        className={"input-row mb-4".concat(" w-[48%] flex-shrink")}
        key={`propertycharacteristics-${index}`}
      >
        {InputElement}
      </div>
    );
  });

  return <div className="flex flex-wrap justify-between">{inputs}</div>;
};

export default FinancialInputFields;
