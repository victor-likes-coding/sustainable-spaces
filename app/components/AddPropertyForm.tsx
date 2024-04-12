import BasicForm from "./BasicForm";
import { ChangeEvent, useState } from "react";
import { Button } from "@nextui-org/react";
import Upload from "./Upload";
import { useSubmit } from "@remix-run/react";
import AddressInputFields from "./AddressInputFields";
import PropertyCharacteristicsInputFields from "./PropertyCharacteristicsInputFields";
import { prepareFormData } from "~/utils/helper";
import {
  AddablePropertyData,
  PurchaseMethod,
  RequiredHiddenPropertyData,
} from "~/types/property.new";
import HiddenPropertyFields from "./HiddenPropertyFields";

type PropertyData = AddablePropertyData & RequiredHiddenPropertyData;
type Props = {
  className?: string;
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
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
      [event.target.name]: event.target.value,
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
          : (event.target.value as PurchaseMethod),
    }));
  };

  const {
    streetAddress,
    city,
    state,
    zipcode,
    bedrooms,
    bathrooms,
    description,
    lotSize,
    livingArea,
    yearBuilt,
    purchaseMethod,
    price,
    garage,
    ...hidden
  } = property;

  const address = { streetAddress, city, state, zipcode };
  const propertyCharacteristicsData = {
    bedrooms,
    bathrooms,
    description,
    lotSize,
    livingArea,
    yearBuilt,
    purchaseMethod,
    price,
    garage: garage || 0,
  };

  return (
    <BasicForm {...props} onSubmit={handleSubmit}>
      <AddressInputFields address={address} setProperty={handleAddressChange} />
      <PropertyCharacteristicsInputFields
        data={propertyCharacteristicsData}
        orderOfInputs={[
          "bedrooms",
          "bathrooms",
          "purchaseMethod",
          "description",
          "lotSize",
          "livingArea",
          "yearBuilt",
          "garage",
          "price",
        ]}
        setProperty={handleChange}
      />
      <HiddenPropertyFields
        hiddenFields={hidden as RequiredHiddenPropertyData}
      />

      <Upload
        files={fileData}
        setFiles={setFileData}
        style={{
          upload: "mb-4",
        }}
      />
      <Button
        type="submit"
        className=" bg-custom-secondary text-xs font-bold text-white mb-4"
      >
        Add
      </Button>
    </BasicForm>
  );
}
