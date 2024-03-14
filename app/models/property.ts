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
  purchaseMethod: z.enum(["rent", "sell"]),
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

const propertySchema = z.object({
  id: z.number(),
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

export type PropertyData = z.infer<typeof propertySchema>; // use for property data from database
export type MutationSafePropertyData = z.infer<typeof mutationSafePropertyData>; // use for property data from frontend
export type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>; // use for property creation

// this class is used for the frontend creating a property
// it is not used for data that comes from the database

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

  static async createProperty(
    property: MutationSafePropertyData
  ): Promise<DatabaseSafePropertyData> {
    // validate we have all the required data
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { zillowLink: _, ...data } =
        mutationSafePropertyData.parse(property); // will throw if failed
      console.log(data);

      // lets tack on the other required properties to create a full property
      // get user from session

      return db.property.create({
        data,
      });
    } catch (e) {
      console.log(e);
      throw new PropertyValidationError({});
    }
  }
  abstract updateProperty(
    property: unknown
  ): Promise<DatabaseSafeProperty | void>;
  abstract deleteProperty(id: number): Promise<void>;
}

export type { FullPropertyData, BasicPropertyData };
