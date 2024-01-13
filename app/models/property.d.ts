import { User } from "./user";
import { Property } from "./property";

export interface BasicPropertyData {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
}

export interface RentalFeeProperties {
  management: number;
  capex: number;
  vacancy: number;
}

export interface FullPropertyData extends BasicPropertyData {
  tax: number;
  hoa: number;
  yearBuilt: number;
  insurance: number;
  updated: Date;
  created: Date;
  rent: number;
  payment: number;
  garage: number;
  owner: User | string;
  tenant: User | string;
  likes: number[];
  likesCount: number;
  longitude: number;
  latitude: number;
  description: string;
  allowRentOption: boolean;
}

export abstract class PropertyService {
  abstract getProperties(): Promise<Property[]>;
  abstract getProperty(id: number): Promise<Property>;
  abstract createProperty(property: Property): Promise<Property>;
  abstract updateProperty(property: Property): Promise<Property>;
  abstract deleteProperty(id: number): Promise<void>;
}
