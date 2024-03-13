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
  address: Record<keyof Address, string>;
  fees: PropertyFees;
  updated: Date;
  created: Date;
  price: number;
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
  livingArea: number;
  homeType: string;
  bedrooms: number;
  bathrooms: number;
  timestamp: string | undefined;
  lotAreaUnits: string;
  livingAreaUnits: string;
  tax: number | undefined;
  annualHomeownersInsurance: number;
  zillowLink: string | undefined;
  constructor(data: FullPropertyData) {
    const {
      id,
      paymentType,
      address,
      fees,
      updated,
      created,
      price,
      garage,
      owner,
      tenant,
      likes = [],
      likesCount,
      longitude,
      latitude,
      description,
      zpid,
      yearBuilt,
      parcelId,
      lotSize,
      livingArea,
      homeType,
      bedrooms,
      bathrooms,
      timestamp,
      lotAreaUnits,
      livingAreaUnits,
      tax,
      annualHomeownersInsurance,
      zillowLink,
    } = data;

    this.id = id;
    this.paymentType = paymentType;
    this.address = address;
    this.fees = fees;
    this.updated = updated;
    this.created = created;
    this.price = price;
    this.garage = garage;
    this.owner = owner;
    this.tenant = tenant;
    this.likes = likes;
    this.likesCount = likesCount;
    this.longitude = longitude;
    this.latitude = latitude;
    this.description = description;
    this.zpid = zpid;
    this.yearBuilt = yearBuilt;
    this.parcelId = parcelId;
    this.lotSize = lotSize;
    this.livingArea = livingArea;
    this.homeType = homeType;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.timestamp = timestamp;
    this.lotAreaUnits = lotAreaUnits;
    this.livingAreaUnits = livingAreaUnits;
    this.tax = tax;
    this.annualHomeownersInsurance = annualHomeownersInsurance;
    this.zillowLink = zillowLink;
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
