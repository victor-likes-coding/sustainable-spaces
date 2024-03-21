import { AddressData } from "./property";

// props from zillow scrape
export interface ZillowPropertyData {
  zpid: number | string;
  yearBuilt: number | string;
  parcelId: string;
  lotSize: number | string;
  lotAreaUnits: string;
  livingArea: number | string;
  livingAreaUnits: string;
  latitude: number | string;
  longitude: number | string;
  homeType: string;
  description: string;
  bedrooms: number | string;
  bathrooms: number | string;
  address: Record<keyof AddressData, string>;
  timestamp?: string;
  tax?: number | string;
  annualHomeownersInsurance: number | string;
  zillowLink?: string;
  price: number | string;
  garage: number | string;
}

export interface PropertyFormData {
  zpid: string;
  yearBuilt: string;
  parcelId: string;
  lotSize: string;
  lotAreaUnits: string;
  livingArea: string;
  livingAreaUnits: string;
  latitude: string;
  longitude: string;
  homeType: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  address: AddressData;
  timestamp?: string;
  tax?: string;
  annualHomeownersInsurance: string;
  zillowLink?: string;
  price: string;
  garage: string;
}
