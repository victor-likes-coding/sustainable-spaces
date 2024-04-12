// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { RequiredZillowPropertyWithOtherData } from "~/types/Zillow";

export function filterObject<Type extends RequiredZillowPropertyWithOtherData>(
  obj: Type
): RequiredZillowPropertyWithOtherData {
  const propertyKeys: Array<keyof Type> = [
    "zpid",
    "city",
    "state",
    "bedrooms",
    "bathrooms",
    "price",
    "yearBuilt",
    "streetAddress",
    "zipcode",
    "monthlyHoaFee",
    "parcelId",
    "description",
    "latitude",
    "longitude",
    "propertyTaxRate",
    "livingAreaUnits",
    "lotSize",
    "lotAreaValue",
    "lotAreaUnits",
    "annualHomeownersInsurance",
    "livingArea",
    "homeType",
  ];

  const filteredObject: Type = {
    garage: 0,
  } as Type;

  for (const key of propertyKeys) {
    filteredObject[key] = obj[key];
  }

  return filteredObject;
}
