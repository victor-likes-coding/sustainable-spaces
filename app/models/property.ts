import { FullPropertyData, BasicPropertyData } from "./property.d";
import { User } from "./user";

export class Property implements FullPropertyData {
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
  owner: string | User;
  tenant: string | User;
  likes: number[];
  likesCount: number;
  longitude: number;
  latitude: number;
  description: string;
  allowRentOption: boolean;

  constructor(data: FullPropertyData) {
    this.id = data.id;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.price = data.price;
    this.beds = data.beds;
    this.baths = data.baths;
    this.sqft = data.sqft;
    this.tax = data.tax;
    this.hoa = data.hoa;
    this.yearBuilt = data.yearBuilt;
    this.management = data.management;
    this.insurance = data.insurance;
    this.capex = data.capex;
    this.vacancy = data.vacancy;
    this.updated = data.updated;
    this.created = data.created;
    this.rent = data.rent;
    this.payment = data.payment;
    this.garage = data.garage;
    this.owner = data.owner;
    this.tenant = data.tenant;
    this.likes = data.likes;
    this.likesCount = data.likesCount;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.description = data.description;
    this.allowRentOption = data.allowRentOption;
  }
}

export abstract class PropertyService {
  abstract getProperties(): Promise<Property[]>;
  abstract getProperty(id: number): Promise<Property>;
  abstract createProperty(property: Property): Promise<Property>;
  abstract updateProperty(property: Property): Promise<Property>;
  abstract deleteProperty(id: number): Promise<void>;
}

export type { FullPropertyData, BasicPropertyData };
