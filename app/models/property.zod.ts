import { z } from "zod";
import { databaseImageFields } from "./Image";

const updateablePropertyFields = {
  bedrooms: z.number({ coerce: true }),
  bathrooms: z.number({ coerce: true }),
  description: z.string(),
  lotSize: z.number({ coerce: true }),
  livingArea: z.number({ coerce: true }),
  yearBuilt: z.number({ coerce: true }),
  purchaseMethod: z.enum(["rent", "sell"]),
  price: z.number({ coerce: true }),
  homeType: z.enum([
    "SINGLE_FAMILY",
    "MULTI_FAMILY",
    "CONDO",
    "TOWNHOUSE",
    "MOBILE_HOME",
    "LAND",
    "OTHER",
  ]),
  latitude: z.number({ coerce: true }),
  longitude: z.number({ coerce: true }),
  garage: z.number({ coerce: true }),
  annualHomeownersInsurance: z.number({ coerce: true }),
  tax: z.number({ coerce: true }),
  zillowLink: z.string().optional().nullable(),
};

const nonUpdateablePropertyFields = {
  zpid: z.number({ coerce: true }),
  livingAreaUnits: z.string(),
  lotAreaUnits: z.string(),
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
  likes: z.array(z.number()).default([]),
  likesCount: z.number(),
};

const propertyFeeFields = {
  hoa: z.number({ coerce: true }).optional().nullable(),
  management: z.number({ coerce: true }),
  capex: z.number({ coerce: true }),
  vacancy: z.number({ coerce: true }),
};

const generatedDataFields = {
  id: z.number(),
  updated: z
    .string()
    .datetime()
    .or(z.date({ coerce: true })),
  created: z
    .string()
    .datetime()
    .or(z.date({ coerce: true })),
};

const propertyDataFields = {
  id: z.number(),
  ...updateablePropertyFields,
  images: z.array(z.object(databaseImageFields)).default([]),
  ...commonPropertyFields,
  ...nonUpdateablePropertyFields,
};

const editingPropertyFields = {
  ...updateablePropertyFields,
  ...addressPropertyFields,
  ...propertyFeeFields,
};

// parseable schemas

export const editablePropertySchema = z.object(editingPropertyFields);

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
  ...nonUpdateablePropertyFields,
  ...propertyFeeFields,
});

export const mutationSafePropertyData = z.object({
  ...nonUpdateablePropertyFields,
  ...addressPropertyFields,
  ...updateablePropertyFields,
}); // this is for creating a property as well

export type PropertyFeeData = z.infer<typeof propertyFeeSchema>;
export type AddressData = z.infer<typeof addressPropertySchema>;

export type EditablePropertyData = z.infer<typeof editablePropertySchema>; // When editing a property
export type MutationSafePropertyData = z.infer<typeof mutationSafePropertyData>; // When creating a property, parse will use this to coerce the types and validate the data
export type DatabaseSafePropertyData = z.infer<typeof databaseSafePropertyData>; // When creating a property

export type PropertyData = z.infer<typeof databasePropertySchema>; // from database
export type PropertyDataStructure = z.infer<typeof propertySchema>; // use for property data from database
// this class is used for the frontend creating a property
// it is not used for data that comes from the database
