import type { PropertyFormData } from "./property.d";
import { db } from "~/utils/db.server";
import { z } from "zod";
import { PropertyValidationError } from "~/utils/errors";

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
  ownerId: z.number({ coerce: true }),
};

const addressPropertyFields = {
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
};

const commonPropertyFields = {
  tenantId: z.number({ coerce: true }).optional().nullable(),
  likes: z.array(z.number()).optional(),
  likesCount: z.number().optional(),
  timestamp: z.string().optional(),
};

const propertyFeeFields = {
  hoa: z.number({ coerce: true }).optional().nullable(),
  management: z.number({ coerce: true }).optional(),
  capex: z.number({ coerce: true }).optional(),
  vacancy: z.number({ coerce: true }).optional(),
};

const propertyDataFields = {
  id: z.number(),
  updated: z.string().datetime().or(z.date()),
  created: z.string().datetime().or(z.date()),
  ...commonPropertyFields,
  ...createPropertyFields,
};

const databasePropertySchema = z.object({
  ...propertyDataFields,
  ...addressPropertyFields,
  ...propertyFeeFields,
});

const propertySchema = z.object({
  ...propertyDataFields,
  address: z.object(addressPropertyFields),
  fees: z.object(propertyFeeFields),
});

const propertyFeeSchema = z.object(propertyFeeFields);
const addressPropertySchema = z.object(addressPropertyFields);

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

export type PropertyFeeData = z.infer<typeof propertyFeeSchema>; //
export type AddressData = z.infer<typeof addressPropertySchema>;
export type MutationSafePropertyData = z.infer<typeof mutationSafePropertyData>; // use for property data from frontend
export type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>; // use for property creation
export type PropertyData = z.infer<typeof databasePropertySchema>; // from database
export type PropertyDataStructure = z.infer<typeof propertySchema>; // use for property data from database
// this class is used for the frontend creating a property
// it is not used for data that comes from the database

export abstract class PropertyService {
  static getProperties(): Promise<PropertyData[]> {
    return db.property.findMany();
  }

  static getProperty(id: number): Promise<PropertyData | null> {
    return db.property.findUnique({
      where: {
        id,
      },
    });
  }

  static getPropertyByAddress({
    streetAddress,
    state,
    zipcode,
  }: AddressData): Promise<PropertyData | null> {
    return db.property.findFirst({
      where: {
        AND: {
          streetAddress,
          state,
          zipcode,
        },
      },
    });
  }

  static async createProperty(
    property: MutationSafePropertyData
  ): Promise<PropertyData> {
    // validate we have all the required data
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { zillowLink: _, ...data } =
        mutationSafePropertyData.parse(property); // will throw if failed

      // lets tack on the other required properties to create a full property
      // get user from session

      return db.property.create({
        data,
      });
    } catch (e) {
      throw new PropertyValidationError({});
    }
  }
  abstract updateProperty(
    property: unknown
  ): Promise<DatabaseSafePropertyData | void>;
  abstract deleteProperty(id: number): Promise<void>;
}

// this class is used for representing a property from the database
export class DatabaseProperty implements PropertyDataStructure {
  id: number;
  purchaseMethod: "rent" | "sell";
  tenantId: number | null | undefined;
  likes: number[] | undefined;
  likesCount: number | undefined;
  timestamp: string | undefined;
  zpid: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  lotSize: number;
  livingArea: number;
  yearBuilt: number;
  price: number;
  homeType: string;
  latitude: number;
  longitude: number;
  livingAreaUnits: string;
  lotAreaUnits: string;
  tax: number;
  annualHomeownersInsurance: number;
  zillowLink: string | undefined;
  garage: number | undefined;
  parcelId: string;
  ownerId: number;
  fees: {
    hoa: number | null | undefined;
    management: number | undefined;
    capex: number | undefined;
    vacancy: number | undefined;
  };
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
  };
  updated: Date | string;
  created: Date | string;
  constructor(data: PropertyData) {
    this.id = data.id;
    this.purchaseMethod = data.purchaseMethod;
    this.tenantId = data.tenantId;
    this.likes = data.likes;
    this.likesCount = data.likesCount;
    this.timestamp = data.timestamp;
    this.zpid = data.zpid;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.description = data.description;
    this.lotSize = data.lotSize;
    this.livingArea = data.livingArea;
    this.yearBuilt = data.yearBuilt;
    this.price = data.price;
    this.homeType = data.homeType;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.livingAreaUnits = data.livingAreaUnits;
    this.lotAreaUnits = data.lotAreaUnits;
    this.tax = data.tax;
    this.annualHomeownersInsurance = data.annualHomeownersInsurance;
    this.zillowLink = data.zillowLink;
    this.garage = data.garage;
    this.parcelId = data.parcelId;
    this.ownerId = data.ownerId;
    this.fees = {
      hoa: data.hoa,
      management: data.management,
      capex: data.capex,
      vacancy: data.vacancy,
    };
    this.address = {
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
    };
    this.updated = new Date(data.updated);
    this.created = new Date(data.created);
  }
}

export type { PropertyFormData };
