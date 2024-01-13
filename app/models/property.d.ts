import { User } from "./user";

export type PropertyData = {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
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
};
