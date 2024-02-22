import {
  FullPropertyData,
  BasicPropertyData,
  Address,
  PropertyFees,
} from "./property.d";
import { User } from "./user";

export class Property implements FullPropertyData {
  id: number;
  paymentType: "rent" | "sell";
  address: Address;
  fees: PropertyFees;
  updated: Date;
  created: Date;
  payment: number;
  garage: number;
  owner: string | User;
  tenant: string | User;
  likes: number[];
  likesCount: number;
  longitude: number;
  latitude: number;
  description: string;
  zpid: number;
  yearBuilt: number;
  parcelId: string;
  lotSize: number;
  lotAreaUnit: string;
  livingArea: number;
  livingAreaUnit: string;
  homeType: string;
  bedrooms: number;
  bathrooms: number;
  timestamp?: string | undefined;

  constructor(data: FullPropertyData) {
    this.id = data.id;
    this.address = data.address;
    this.fees = data.fees;
    this.paymentType = data.paymentType;
    this.updated = data.updated;
    this.created = data.created;
    this.payment = data.payment;
    this.garage = data.garage;
    this.owner = data.owner;
    this.tenant = data.tenant;
    this.likes = data.likes;
    this.likesCount = data.likesCount;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.description = data.description;
    this.zpid = data.zpid;
    this.yearBuilt = data.yearBuilt;
    this.parcelId = data.parcelId;
    this.lotSize = data.lotSize;
    this.lotAreaUnit = data.lotAreaUnit;
    this.livingArea = data.livingArea;
    this.livingAreaUnit = data.livingAreaUnit;
    this.homeType = data.homeType;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.timestamp = data.timestamp;
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
