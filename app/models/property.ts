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
import { getUser } from "~/utils/sessions.server";

const createPropertyFields = {
  zpid: z.number({ coerce: true }),
  bedrooms: z.number({ coerce: true }),
  bathrooms: z.number({ coerce: true }),
  description: z.string(),
  lotSize: z.number({ coerce: true }),
  livingArea: z.number({ coerce: true }),
  yearBuilt: z.number({ coerce: true }),
  purchaseMethod: z.enum(["rent", "sell"]),
  price: z.number({ coerce: true }),
  homeType: z.string(),
  latitude: z.number({ coerce: true }),
  longitude: z.number({ coerce: true }),
  livingAreaUnits: z.string(),
  lotAreaUnits: z.string(),
  tax: z.number({ coerce: true }),
  annualHomeownersInsurance: z.number({ coerce: true }),
  zillowLink: z.string().optional(),
  garage: z.number({ coerce: true }).optional(),
  parcelId: z.string(),
};

const addressPropertyFields = {
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
};

const commonPropertyFields = {
  id: z.number(),
  purchaseMethod: z.enum(["rent", "sell"]),
  ownerId: z.number({ coerce: true }),
  tenantId: z.number({ coerce: true }).optional().nullable(),
  likes: z.array(z.number()),
  likesCount: z.number(),
  timestamp: z.string().optional(),
};

const propertyFeeFields = {
  hoa: z.number({ coerce: true }).optional().nullable(),
  management: z.number({ coerce: true }),
  capex: z.number({ coerce: true }),
  vacancy: z.number({ coerce: true }),
};

const propertySchema = z.object({
  ...commonPropertyFields,
  ...createPropertyFields,
  fees: z.object(propertyFeeFields),
  address: z.object(addressPropertyFields),
  updated: z.date(),
  created: z.date(),
});

const databaseSafePropertyData = z.object({
  ...commonPropertyFields,
  ...addressPropertyFields,
  ...createPropertyFields,
  ...propertyFeeFields,
});

const mutationSafePropertyData = z.object({
  ...createPropertyFields,
  ...addressPropertyFields,
});

export type PropertyData = z.infer<typeof propertySchema>;
export type MutationSafePropertyData = z.infer<typeof mutationSafePropertyData>;
export type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>;

// this class is used for the frontend creating a property
// it is not used for data that comes from the database

export class Property implements PropertyData {
  id: number;
  purchaseMethod: "rent" | "sell";
  address: Address; // Add the 'address' property
  fees: PropertyFees; // Add the 'fees' property
  ownerId: number; // Add the 'owner' property
  tenantId: number | undefined | null; // Add the 'tenant' property
  updated: Date;
  created: Date;
  price: number;
  garage: number | undefined;
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
  tax: number;
  annualHomeownersInsurance: number;
  zillowLink: string | undefined;

  constructor(data: PropertyData) {
    const {
      id,
      purchaseMethod,
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
    this.purchaseMethod = purchaseMethod;
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
      purchaseMethod: this.purchaseMethod,
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
      zillowLink: this.zillowLink,
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
