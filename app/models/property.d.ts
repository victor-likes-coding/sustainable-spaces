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

export interface FullPropertyData extends BasicPropertyData {
  tax: number;
  hoa: number;
  yearBuilt: number;
  management: number;
  insurance: number;
  capex: number;
  vacancy: number;
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
};
