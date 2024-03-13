import {
  FullPropertyData,
  BasicPropertyData,
  Address,
  PropertyFees,
  DatabaseSafeProperty,
} from "./property.d";
import { User } from "./user";
import { db } from "~/utils/db.server";

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

  getAddressData(): Address {
    return this.address;
  }

  getFeesData(): PropertyFees {
    return this.fees;
  }

  getDatabaseRequiredData(): DatabaseSafeProperty {
    return {
      ...this.getFeesData(),
      ...this.getAddressData(),
      id: this.id,
      paymentType: this.paymentType,
      price: this.price,
      garage: this.garage,
      owner: this.owner,
      tenant: this.tenant,
      likes: this.likes,
      likesCount: this.likesCount,
      longitude: this.longitude,
      latitude: this.latitude,
      description: this.description,
      zpid: this.zpid,
      yearBuilt: this.yearBuilt,
      parcelId: this.parcelId,
      lotSize: this.lotSize,
      livingArea: this.livingArea,
      homeType: this.homeType,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      lotAreaUnits: this.lotAreaUnits,
      livingAreaUnits: this.livingAreaUnits,
      tax: this.tax,
      annualHomeownersInsurance: this.annualHomeownersInsurance,
    };
  }
}

export abstract class PropertyService {
  static getProperties(): Promise<DatabaseSafeProperty[]> {
    return db.property.findMany();
  }
  abstract getProperty(id: number): Promise<Property>;
  abstract createProperty(property: Property): Promise<Property>;
  abstract updateProperty(property: Property): Promise<Property>;
  abstract deleteProperty(id: number): Promise<void>;
}

export type { FullPropertyData, BasicPropertyData };
