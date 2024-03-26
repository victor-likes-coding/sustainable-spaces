import BasicForm from "./BasicForm";
import { ChangeEvent, useState } from "react";
import { Button } from "@nextui-org/react";
import Upload from "./Upload";
import { useSubmit } from "@remix-run/react";
import { FormDataType } from "~/routes/property.add._index";
import AddressInputFields from "./AddressInputFields";
import PropertyCharacteristicsInputFields from "./PropertyCharacteristicsInputFields";
import HiddenPropertyFields, { HiddenFields } from "./HiddenPropertyFields";
import { prepareFormData } from "~/utils/helper";

type Props = {
  className?: string;
  property: FormDataType;
  setProperty: React.Dispatch<React.SetStateAction<FormDataType>>;
  method: "post" | "get" | "put" | "delete";
  action?: string;
};

export default function AddPropertyForm({
  property,
  setProperty,
  ...props
}: Props) {
  const submit = useSubmit();

  const [fileData, setFileData] = useState<FileList | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = prepareFormData(property, fileData);

    submit(formData, { encType: "multipart/form-data", method: "post" });
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      address: {
        ...prevProperty.address,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [event.target.name]:
        event.target.tagName === "INPUT"
          ? event.target.value
          : (event.target.value as "rent" | "sell"),
    }));
  };

  const {
    bedrooms,
    bathrooms,
    description,
    lotSize,
    livingArea,
    yearBuilt,
    purchaseMethod,
    price,
    ...rest
  } = property;

  const { address, ...hidden } = rest;

  const propertyCharacteristicsData = {
    bedrooms,
    bathrooms,
    description,
    lotSize,
    livingArea,
    yearBuilt,
    purchaseMethod,
    price,
  };

  return (
    <BasicForm {...props} onSubmit={handleSubmit}>
      <AddressInputFields address={address} setProperty={handleAddressChange} />
      <PropertyCharacteristicsInputFields
        data={propertyCharacteristicsData}
        setProperty={handleChange}
      />

      <HiddenPropertyFields hiddenFields={hidden as HiddenFields} />
      <Upload
        files={fileData}
        setFiles={setFileData}
        style={{
          upload: "mb-4",
        }}
      />
      <Button
        type="submit"
        className=" bg-secondary text-xs font-bold text-white mb-4"
      >
        Add
      </Button>
    </BasicForm>
  );
}
