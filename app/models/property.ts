import {
  FullPropertyData,
  BasicPropertyData,
  Address,
  PropertyFees,
  DatabaseSafeProperty,
} from "./property.d";
import { db } from "~/utils/db.server";
import { z } from "zod";
import { PropertyValidationError } from "~/utils/errors";

const addressPropertyFields = {
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
};

const commonPropertyFields = {
  id: z.number(),
  paymentType: z.enum(["rent", "sell"]),
  price: z.number(),
  garage: z.number(),
  ownerId: z.number(),
  tenantId: z.number().optional().nullable(),
  likes: z.array(z.number()),
  likesCount: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  description: z.string(),
  zpid: z.number(),
  yearBuilt: z.number(),
  parcelId: z.string(),
  lotSize: z.number(),
  livingArea: z.number(),
  homeType: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  timestamp: z.string().optional(),
  lotAreaUnits: z.string(),
  livingAreaUnits: z.string(),
  tax: z.number().optional(),
  annualHomeownersInsurance: z.number(),
  zillowLink: z.string().optional(),
};

const propertySchema = z.object({
  ...commonPropertyFields,
  fees: z.object({
    hoa: z.number().optional().nullable(),
    management: z.number(),
    capex: z.number(),
    vacancy: z.number(),
  }),
  address: z.object(addressPropertyFields),
  updated: z.date(),
  created: z.date(),
});

const databaseSafePropertyData = z.object({
  ...commonPropertyFields,
  ...addressPropertyFields,
  hoa: z.number().optional().nullable(),
  management: z.number(),
  capex: z.number(),
  vacancy: z.number(),
});

type PropertyData = z.infer<typeof propertySchema>;
type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>;

export class Property implements PropertyData {
  id: number;
  paymentType: "rent" | "sell";
  address: Address; // Add the 'address' property
  fees: PropertyFees; // Add the 'fees' property
  ownerId: number; // Add the 'owner' property
  tenantId: number | undefined | null; // Add the 'tenant' property
  updated: Date;
  created: Date;
  price: number;
  garage: number;
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

  constructor(data: PropertyData) {
    const {
      id,
      paymentType,
      address,
      fees,
      ownerId,
      tenantId,
      updated,
      created,
      price,
      garage,
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
    this.address = address as Address;
    this.fees = fees;
    this.ownerId = ownerId;
    this.tenantId = tenantId;
    this.updated = updated;
    this.created = created;
    this.price = price;
    this.garage = garage;
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

  getDatabaseRequiredData(): DatabaseSafePropertyData {
    return {
      ...this.getFeesData(),
      ...this.getAddressData(),
      id: this.id,
      paymentType: this.paymentType,
      price: this.price,
      garage: this.garage,
      ownerId: this.ownerId,
      tenantId: this.tenantId,
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
  static getProperties(): Promise<DatabaseSafePropertyData[]> {
    return db.property.findMany();
  }

  static getProperty(id: number): Promise<DatabaseSafePropertyData | null> {
    return db.property.findUnique({
      where: {
        id,
      },
    });
  }

  static createProperty(property: Property): Promise<DatabaseSafePropertyData> {
    const databaseSafeProperty = property.getDatabaseRequiredData();

    // validate we have all the required data
    try {
      databaseSafePropertyData.parse(databaseSafeProperty); // will throw if failed
    } catch (e) {
      throw new PropertyValidationError({});
    }
  }
  abstract updateProperty(
    property: Property
  ): Promise<DatabaseSafeProperty | void>;
  abstract deleteProperty(id: number): Promise<void>;
}

export type { FullPropertyData, BasicPropertyData };
