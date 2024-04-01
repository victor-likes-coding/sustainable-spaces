import { AddressData } from "~/models/property.zod";
import { ZillowPropertyData } from "../models/property.d";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterObject(obj: any): Partial<ZillowPropertyData> {
  const filteredObject: Partial<ZillowPropertyData> = {
    garage: 0,
  };
  const dataKeys = Object.keys(obj) as Array<keyof ZillowPropertyData>;
  // filter keys based on zillowPropertyData type only
  const keys = [
    "zpid",
    "yearBuilt",
    "parcelId",
    "lotSize",
    "lotAreaUnits",
    "livingArea",
    "livingAreaUnits",
    "latitude",
    "longitude",
    "homeType",
    "description",
    "bedrooms",
    "bathrooms",
    "timestamp",
    "insurance",
    "annualHomeownersInsurance",
    "zillowLink",
    "city",
    "state",
    "streetAddress",
    "zipcode",
    "price",
    "garage",
  ];

  const addressKeys = ["city", "state", "streetAddress", "zipcode"];

  for (const key of dataKeys) {
    if (keys.includes(key as string)) {
      if (addressKeys.includes(key as string)) {
        filteredObject.address = filteredObject.address || ({} as AddressData);
        filteredObject.address[key as keyof AddressData] = obj[key];
      } else {
        filteredObject[key] = obj[key];
      }
    }
  }

  return filteredObject;
}
