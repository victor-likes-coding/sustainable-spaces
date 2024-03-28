import { z } from "zod";
import { databaseImageFields } from "./Image";

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
  zillowLink: z.string().optional().nullable(),
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
  images: z.array(z.object(databaseImageFields)).optional(),
  ...commonPropertyFields,
  ...createPropertyFields,
};

export const databasePropertySchema = z.object({
  ...propertyDataFields,
  ...addressPropertyFields,
  ...propertyFeeFields,
});

export const propertySchema = z.object({
  ...propertyDataFields,
  address: z.object(addressPropertyFields),
  fees: z.object(propertyFeeFields),
});

export const propertyFeeSchema = z.object(propertyFeeFields);
export const addressPropertySchema = z.object(addressPropertyFields);

const databaseSafePropertyData = z.object({
  ...commonPropertyFields,
  ...addressPropertyFields,
  ...createPropertyFields,
  ...propertyFeeFields,
});

export const mutationSafePropertyData = z.object({
  ...createPropertyFields,
  ...addressPropertyFields,
});

export type PropertyFeeData = z.infer<typeof propertyFeeSchema>;
export type AddressData = z.infer<typeof addressPropertySchema>;

export type MutationSafePropertyData = z.infer<typeof mutationSafePropertyData>; // use for property data from frontend
export type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>; // use for property creation

export type PropertyData = z.infer<typeof databasePropertySchema>; // from database
export type PropertyDataStructure = z.infer<typeof propertySchema>; // use for property data from database
// this class is used for the frontend creating a property
// it is not used for data that comes from the database
