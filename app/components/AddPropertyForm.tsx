import BasicForm from "./BasicForm";
import { useState } from "react";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import Upload from "./Upload";
import { useSubmit } from "@remix-run/react";
import { FormDataType } from "~/routes/property.add._index";

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
    const formData = new FormData();
    formData.append("property", JSON.stringify(property));

    // append all files to the form data
    if (fileData) {
      for (let i = 0; i < fileData.length; i++) {
        formData.append("files", fileData[i]);
      }
    }

    submit(formData, { encType: "multipart/form-data", method: "post" });
  };
  return (
    <BasicForm {...props} onSubmit={handleSubmit}>
      <div className="input-group w-full flex flex-col">
        <Input
          label="Street Address"
          id="streetAddress"
          type="text"
          name="streetAddress"
          className="rounded-sm  text-secondary"
          value={property?.address.streetAddress}
          onChange={(e) => {
            setProperty((prevProperty) => ({
              ...prevProperty,
              address: {
                ...prevProperty.address,
                streetAddress: e.target.value,
              },
            }));
          }}
        />
      </div>
      <div className="input-group flex flex-col w-full grow">
        <Input
          label="City"
          type="text"
          name="city"
          id="city"
          value={property?.address.city}
          className="rounded-sm  text-secondary"
          onChange={(e) =>
            setProperty((prevProperty) => ({
              ...prevProperty,
              address: {
                ...prevProperty.address,
                city: e.target.value,
              },
            }))
          }
        />
      </div>
      <div className="flex justify-between">
        <div className="input-group flex flex-col w-[34%]">
          <Input
            label="State"
            type="text"
            name="state"
            id="state"
            value={property?.address.state}
            className="rounded-sm  text-secondary"
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                address: {
                  ...prevProperty.address,
                  state: e.target.value,
                },
              }))
            }
          />
        </div>

        <div className="input-group flex flex-col">
          <Input
            label="Zipcode"
            type="text"
            name="zipcode"
            className="rounded-sm  text-secondary"
            id="zipcode"
            value={property?.address.zipcode}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                address: {
                  ...prevProperty.address,
                  zipcode: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="input-group w-[48%] flex flex-col">
          <Input
            label="Bedrooms"
            name="bedrooms"
            className="rounded-sm  text-secondary"
            id="bedrooms"
            value={property?.bedrooms}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                bedrooms: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-group w-[48%] flex flex-col">
          <Input
            label="Bathrooms"
            type="number"
            name="bathrooms"
            className="rounded-sm  text-secondary"
            id="bathrooms"
            value={property?.bathrooms}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                bathrooms: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="input-group w-full flex flex-col">
        <Textarea
          label="Description"
          className="rounded-sm text-secondary text-xs"
          aria-label="description"
          rows={10}
          name="description"
          id="description"
          value={property?.description}
          onChange={(e) =>
            setProperty((prevProperty) => ({
              ...prevProperty,
              description: e.target.value,
            }))
          }
        />
      </div>
      <div className="flex justify-between">
        <div className="input-group w-[48%] flex flex-col">
          <Input
            type="number"
            name="lotSize"
            label="Lot Size (sqft)"
            className="rounded-sm  text-secondary"
            id="lotSize"
            value={property?.lotSize}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                lotSize: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-group w-[48%] flex flex-col">
          <Input
            label="Living Area (sqft)"
            type="number"
            name="livingArea"
            className="rounded-sm  text-secondary"
            id="livingArea"
            value={property?.livingArea}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                livingArea: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="input-group w-[48%] flex flex-col">
          <Input
            label="Year Built"
            type="number"
            name="yearBuilt"
            className="rounded-sm  text-secondary"
            id="yearBuilt"
            value={property?.yearBuilt}
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                yearBuilt: e.target.value,
              }))
            }
          />
        </div>

        <div className="input-group w-[48%] flex flex-col">
          <Select
            selectionMode="single"
            placeholder="Select an option"
            label="Purchase Method"
            name="purchaseMethod"
            defaultSelectedKeys={["sell"]}
            className="rounded-sm pl-1 text-secondary"
            id="purchaseMethod"
            onChange={(e) =>
              setProperty((prevProperty) => ({
                ...prevProperty,
                purchaseMethod: e.target.value as "rent" | "sell",
              }))
            }
          >
            <SelectItem value="rent" key="rent">
              Rent
            </SelectItem>
            <SelectItem value="sell" key="sell">
              Sell
            </SelectItem>
          </Select>
        </div>
      </div>
      <div className="input-group w-full flex flex-col">
        <Input
          label={property.purchaseMethod === "rent" ? "Rent" : "Price"}
          id="price"
          name="price"
          value={property?.price}
          className="rounded-sm  text-secondary"
          onChange={(e) => {
            setProperty((prevProperty) => ({
              ...prevProperty,
              price: e.target.value,
            }));
          }}
        />
      </div>
      <Input
        type="number"
        className="hidden"
        name="zpid"
        value={property?.zpid}
        readOnly
      />
      <Input
        type="text"
        className="hidden"
        name="homeType"
        value={property?.homeType}
        readOnly
      />
      <Input
        type="number"
        className="hidden"
        name="latitude"
        value={property?.latitude}
        readOnly
      />
      <Input
        type="number"
        className="hidden"
        name="longitude"
        value={property?.longitude}
        readOnly
      />
      <Input
        type="text"
        className="hidden"
        name="livingAreaUnits"
        value={property?.livingAreaUnits}
        readOnly
      />
      <Input
        type="text"
        className="hidden"
        name="lotAreaUnits"
        value={property?.lotAreaUnits}
        readOnly
      />
      <Input
        type="number"
        className="hidden"
        name="tax"
        value={property?.tax}
        readOnly
      />
      <Input
        type="number"
        className="hidden"
        name="annualHomeownersInsurance"
        value={property?.annualHomeownersInsurance}
        readOnly
      />
      <Input
        type="text"
        className="hidden"
        name="zillowLink"
        value={property?.zillowLink}
        readOnly
      />
      <Input
        type="number"
        className="hidden"
        value={property?.garage}
        readOnly
      />
      <Input
        type="text"
        className="hidden"
        name="parcelId"
        value={property?.parcelId}
        readOnly
      />
      <Upload files={fileData} setFiles={setFileData} />
      <button
        type="submit"
        className="rounded-sm bg-secondary py-2 text-xs font-bold text-white mt-2 mb-4"
      >
        Add
      </button>
    </BasicForm>
  );
}
