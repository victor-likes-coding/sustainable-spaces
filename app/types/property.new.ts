import { db } from "~/utils/db.server";
import { z } from "zod";
import { PropertyValidationError } from "~/utils/errors";
import { Address } from "./Address";
import { Image, Prisma, Property as PrismaProperty } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const commonFields = {
  streetAddress: z.string({ coerce: true }), //
  city: z.string({ coerce: true }), //
  state: z.string({ coerce: true }), //
  zipcode: z.string({ coerce: true }), //
  bedrooms: z.number({ coerce: true }), //
  bathrooms: z.number({ coerce: true }), //
  purchaseMethod: z.union([z.literal("rent"), z.literal("sell")]), //
  description: z.string({ coerce: true }), //
  lotSize: z.number({ coerce: true }), //
  livingArea: z.number({ coerce: true }), //
  yearBuilt: z.number({ coerce: true }), //
  garage: z.number({ coerce: true }), //
  price: z.number({ coerce: true }), //
  // add the required hidden fields
  longitude: z.number({ coerce: true }), //
  latitude: z.number({ coerce: true }), //
  homeType: z.union([
    z.literal("SINGLE_FAMILY"),
    z.literal("MULTI_FAMILY"),
    z.literal("CONDO"),
    z.literal("TOWNHOUSE"),
    z.literal("MOBILE_HOME"),
    z.literal("LAND"),
    z.literal("OTHER"),
  ]), //
  tax: z.number({ coerce: true }), //
  annualHomeownersInsurance: z.number({ coerce: true }), //
  monthlyHoaFee: z.number({ coerce: true }).default(0), //
};

const addSchema = z.object({
  ...commonFields,
  parcelId: z.string({ coerce: true }),
  lotAreaUnits: z.string({ coerce: true }),
  livingAreaUnits: z.string({ coerce: true }),
  zpid: z.number({ coerce: true }),
  ownerId: z.number({ coerce: true }),
  zillowLink: z.string({ coerce: true }),
  propertyTaxRate: z.number({ coerce: true }),
});

export const editSchema = z.object({
  ...commonFields,
  capex: z.number({ coerce: true }),
  management: z.number({ coerce: true }),
  vacancy: z.number({ coerce: true }),
});

type ZodAddParsedSchema = z.infer<typeof addSchema>;
export type ZodEditParsedSchema = z.infer<typeof editSchema>;

export type PurchaseMethod = "rent" | "sell";
export type HomeType =
  | "SINGLE_FAMILY"
  | "MULTI_FAMILY"
  | "CONDO"
  | "TOWNHOUSE"
  | "MOBILE_HOME"
  | "LAND"
  | "OTHER";

// represents the fields of creating a new property
export interface AddablePropertyData {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  bedrooms: number;
  bathrooms: number;
  purchaseMethod: PurchaseMethod;
  description: string;
  lotSize: number;
  livingArea: number;
  yearBuilt: number;
  garage: number;
  price: number;
}

export interface RequiredHiddenPropertyData {
  longitude: number;
  latitude: number;
  homeType: HomeType;
  parcelId: string;
  lotAreaUnits: string;
  livingAreaUnits: string;
  zpid: number;
  tax: number;
  annualHomeownersInsurance: number;
  zillowLink: string;
  monthlyHoaFee: number | null;
  propertyTaxRate: number;
}

export interface CreatePropertyData
  extends AddablePropertyData,
    RequiredHiddenPropertyData {
  ownerId: number;
}

interface EditablePropertyData {
  longitude: number;
  latitude: number;
  homeType: HomeType;
  tax: number;
  annualHomeownersInsurance: number;
  capex: number;
  management: number;
  vacancy: number;
  monthlyHoaFee: number;
}

interface NonAddablePropertyData extends EditablePropertyData {
  zpid: number;
  ownerId: number;
  parcelId: number;
  livingAreaUnits: string;
  lotAreaUnits: string;
  timestamp: string | Date;
  zillowLink: string;
  updated: string | Date;
  created: string | Date;
  tenantId: number;
  likes: number[];
  likesCount: number;
  // images: [] // add when creating new image type
  // payments: [] // add later
}

export type PropertyWithImages = PrismaProperty & { images: Image[] };

export class Property
  implements Partial<AddablePropertyData>, Partial<NonAddablePropertyData>
{
  // Add properties and methods here
  constructor(__data: AddablePropertyData & NonAddablePropertyData) {
    Object.assign(this, __data);
  }
}

export abstract class PropertyServiceNew {
  static generateAddableData(): AddablePropertyData {
    return {
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
      bedrooms: 0,
      bathrooms: 0,
      purchaseMethod: "sell" as PurchaseMethod,
      description: "",
      lotSize: 0,
      livingArea: 0,
      yearBuilt: 0,
      garage: 0,
      price: 0,
    };
  }

  static generateHiddenRequiredFields(): RequiredHiddenPropertyData {
    return {
      longitude: 0,
      latitude: 0,
      homeType: "SINGLE_FAMILY",
      parcelId: "",
      lotAreaUnits: "",
      livingAreaUnits: "",
      zpid: 0,
      tax: 0,
      annualHomeownersInsurance: 0,
      zillowLink: "",
      monthlyHoaFee: null,
      propertyTaxRate: 0,
    };
  }

  static generateEmptyProperty(): AddablePropertyData &
    RequiredHiddenPropertyData {
    return {
      ...PropertyServiceNew.generateAddableData(),
      ...PropertyServiceNew.generateHiddenRequiredFields(),
    };
  }

  static getPropertyByAddress({
    streetAddress,
    state,
    zipcode,
  }: Address): Promise<{ id: number } | null> {
    return db.property.findFirst({
      where: {
        AND: {
          streetAddress,
          state,
          zipcode,
        },
      },
      select: {
        id: true,
      },
    });
  }

  static createProperty(data: CreatePropertyData) {
    // Add logic here
    // allow zod to parse the data
    let parsedData: ZodAddParsedSchema;
    try {
      parsedData = addSchema.parse(data);
    } catch (e) {
      throw new PropertyValidationError({});
    }

    return db.property.create({
      data: parsedData,
      select: {
        id: true,
      },
    });
  }

  static getProperties() {
    return db.property.findMany({
      include: { images: { where: { active: true } } },
    });
  }

  static getPropertiesByOwnerId(ownerId: number) {
    return db.property.findMany({
      where: { ownerId },
      include: { images: { where: { active: true } } },
    });
  }

  static getPropertById<T extends Prisma.PropertySelect<DefaultArgs>>(
    id: number,
    select: T
  ) {
    return db.property.findUnique({
      select,
      where: {
        id,
      },
    });
  }

  static async updateProperty<T extends EditablePropertyData & { id: number }>(
    property: T
  ) {
    const { id, ...data } = property;
    return db.property.update({
      where: { id },
      data,
    });
  }

  static transformToPropertyData(property: string) {
    const parsedJson = JSON.parse(property) as ZodEditParsedSchema & {
      images: Image[];
    };
    const { images, ...rest } = parsedJson;

    const data = editSchema.parse(rest);
    return { images, ...data };
  }
}
