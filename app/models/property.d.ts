import { AddressData } from "./property";

// props from zillow scrape
export interface ZillowPropertyData {
  zpid: number;
  yearBuilt: number;
  parcelId: string;
  lotSize: number;
  lotAreaUnits: string;
  livingArea: number;
  livingAreaUnits: string;
  latitude: number;
  longitude: number;
  homeType: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  address: Record<keyof AddressData, string>;
  timestamp?: string;
  tax?: number;
  annualHomeownersInsurance: number;
  zillowLink?: string;
  price: number;
  garage: number;
}
