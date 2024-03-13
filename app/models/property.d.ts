import { User } from "./user";
import { Property } from "./property";

export interface Address {
  city: string;
  state: string;
  streetAddress: string;
  zipcode: string;
}

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
  address: Record<keyof Address, string>;
  timestamp?: string;
  tax?: number;
  annualHomeownersInsurance: number;
  zillowLink?: string;
  price: number;
  garage: number;
}

export interface DefaultDatabaseProperties {
  id: number;
  updated: Date;
  created: Date;
}

export interface BasicPropertyData extends ZillowPropertyData {
  fees: PropertyFees;
}

export interface PropertyFees {
  management: number;
  capex: number;
  vacancy: number;
  hoa?: number;
}

export interface FullPropertyData
  extends BasicPropertyData,
    DefaultDatabaseProperties {
  price: number;
  paymentType: "rent" | "sell";
  garage: number;
  owner: User | string;
  tenant: User | string;
  likes: number[];
  likesCount: number;
}

export abstract class PropertyService {
  abstract getProperties(): Promise<Property[]>;
  abstract getProperty(id: number): Promise<Property>;
  abstract createProperty(property: Property): Promise<Property>;
  abstract updateProperty(property: Property): Promise<Property>;
  abstract deleteProperty(id: number): Promise<void>;
}
