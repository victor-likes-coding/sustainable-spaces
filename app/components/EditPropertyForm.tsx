import BasicForm from "./BasicForm";
import { ChangeEvent, useState } from "react";
import { Button } from "@nextui-org/react";
import { useSubmit } from "@remix-run/react";
import AddressInputFields from "./AddressInputFields";
import PropertyCharacteristicsInputFields from "./PropertyCharacteristicsInputFields";
import {
  handleFileRemoval,
  handleFileUpload,
  prepareFormData,
} from "~/utils/helper";
import CloseSVG from "./svg/Close";
import PlusSVG from "./svg/Plus";
import FinancialInputFields from "./svg/FinancialInputFields";
import { PropertyWithImages } from "~/types/property.new";

type Props = {
  className?: string;
  property: PropertyWithImages;
  setProperty: React.Dispatch<React.SetStateAction<PropertyWithImages>>;
  method: "post" | "get" | "put" | "delete";
  action?: string;
};

export default function EditPropertyForm({
  property,
  setProperty,
  ...props
}: Props) {
  const submit = useSubmit();

  const [fileData, setFileData] = useState<FileList | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = prepareFormData(property, fileData); // prepares form data to upload

    submit(formData, { encType: "multipart/form-data", method: "post" });
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [event.target.name]: event.target.value ?? "",
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

  const handleLocalImageRemoval = (index: number) => {
    const dataTransfer = handleFileRemoval(fileData, index);
    if (dataTransfer !== null && dataTransfer?.files?.length > 0)
      setFileData(dataTransfer.files);
  };

  const handleLocalImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const dataTransfer = handleFileUpload(event, fileData);
    setFileData(dataTransfer.files);
  };

  const markImageAsInactive = (id: number) => {
    // delete image
    const image = images?.filter((image) => image.id === id)[0];
    if (!image) return;

    image.active = false;

    setProperty((prevProperty) => ({
      ...prevProperty,
      images: [...(prevProperty.images ?? []), image],
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
    images,
    garage,
    streetAddress,
    city,
    state,
    zipcode,
    ...rest
  } = property;

  const address = {
    streetAddress,
    city,
    state,
    zipcode,
  };

  const {
    longitude,
    latitude,
    homeType,
    annualHomeownersInsurance,
    tax,
    vacancy,
    capex,
    management,
    monthlyHoaFee,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...hidden
  } = rest;

  const feeFields = {
    vacancy,
    capex,
    management,
    monthlyHoaFee,
    tax,
    annualHomeownersInsurance,
  };

  const propertyCharacteristicsData = {
    bedrooms,
    bathrooms,
    description,
    lotSize,
    livingArea,
    yearBuilt,
    purchaseMethod,
    price,
    garage,
    longitude,
    latitude,
    homeType,
  };

  console.log(images);

  const imagesAreDefined =
    images && images.filter((image) => image.active).length > 0;
  const fileDataIsDefined = fileData && fileData.length > 0;

  return (
    <BasicForm {...props} onSubmit={handleSubmit}>
      {/* need to show images */}
      {/* these are going to be horizontal images / square images / need to enforce aspect ratio when adding images in the future! */}
      {/* show images */}
      <div className="image-container flex overflow-x-scroll mb-4">
        {imagesAreDefined && (
          <>
            {images
              .filter((image) => image.active)
              .map((image) => (
                <div
                  key={image.id}
                  className="image-container__wrapper flex-shrink-0 flex-grow-0 basis-72 relative"
                >
                  <img
                    src={image.url}
                    alt="property"
                    className="image-container__image"
                  />

                  <CloseSVG
                    onClick={() => {
                      markImageAsInactive(image.id);
                    }}
                  />
                </div>
              ))}
          </>
        )}
        {/* this is where the file uploads will appear */}
        {fileDataIsDefined && (
          <>
            {Array.from(fileData).map((file, index) => (
              <div
                key={file.name}
                className="image-container__wrapper flex-shrink-0 flex-grow-0 basis-72 relative"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="property"
                  className="image-container__image"
                />
                <CloseSVG onClick={() => handleLocalImageRemoval(index)} />
              </div>
            ))}
          </>
        )}
        {/* this is where the upload component will appear */}
        <div
          className={
            "image-container__upload flex-shrink-0 flex-grow-0 basis-72 relative bg-slate-600 flex items-center justify-center"
          }
        >
          <button
            type="button"
            className={"flex justify-center items-center "
              .concat(
                imagesAreDefined ? "w-full h-full" : "w-[288px] h-[192px]"
              )
              .trim()}
            onClick={() => {
              const fileInput = document.getElementById(
                "file"
              ) as HTMLInputElement;
              fileInput.click();
            }}
          >
            <PlusSVG
              style={{ svg: "flex items-center justify-center" }}
              size={5}
            />
            <input
              type="file"
              className="hidden-input"
              id="file"
              name="file"
              multiple
              accept="image/*"
              onChange={handleLocalImageUpload}
            />
          </button>
        </div>
        {/* it'll be a horizontal upload with a different design */}
      </div>
      <AddressInputFields address={address} setProperty={handleAddressChange} />
      <PropertyCharacteristicsInputFields
        data={propertyCharacteristicsData}
        setProperty={handleChange}
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
          "latitude",
          "longitude",
          "homeType",
        ]}
      />
      <FinancialInputFields data={feeFields} setProperty={handleChange} />
      <Button
        type="submit"
        className=" bg-custom-secondary text-xs font-bold text-white mb-4 w-full"
      >
        Update
      </Button>
    </BasicForm>
  );
}
