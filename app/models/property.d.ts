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
  lotAreaUnit: string;
  livingArea: number;
  livingAreaUnit: string;
  latitude: number;
  longitude: number;
  homeType: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  address: Address;
  timestamp?: string;
}

export interface DefaultDatabaseProperties {
  updated: Date;
  created: Date;
}

export interface BasicPropertyData extends ZillowPropertyData {
  id: number;
  fees: PropertyFees;
}

export interface PropertyFees {
  management: number;
  capex: number;
  vacancy: number;
  tax: number;
  hoa?: number;
  insurance: number;
}

export interface FullPropertyData
  extends BasicPropertyData,
    DefaultDatabaseProperties {
  payment: number;
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
