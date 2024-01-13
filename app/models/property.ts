import { PropertyData } from "./property.d";
import { User } from "./user";

interface iProperty {
  id: string;
  address: string;
  zip: string;
  city: string;
  unit: string;
  longitude: string;
  latitude: string;
  balance: number;
  capExFee: number;
  managementFee: number;
  rent: number;
  owner: User;
  renter: User;
}
export class Property implements iProperty {
  owner: User;
  renter: User;
  id: string;
  address: string;
  zip: string;
  city: string;
  unit: string;
  longitude: string;
  latitude: string;
  balance: number;
  capExFee: number;
  managementFee: number;
  rent: number;

  constructor({
    owner,
    renter,
    id,
    address,
    zip,
    city,
    unit,
    longitude,
    latitude,
    balance,
    capExFee,
    managementFee,
    rent,
  }: iProperty) {
    this.owner = owner;
    this.renter = renter;
    this.id = id;
    this.address = address;
    this.zip = zip;
    this.city = city;
    this.unit = unit;
    this.longitude = longitude;
    this.latitude = latitude;
    this.balance = balance;
    this.capExFee = capExFee;
    this.managementFee = managementFee;
    this.rent = rent;
  }
}

export type { PropertyData };
