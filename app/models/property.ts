import type { PropertyFormData } from "./property.d";
import { db } from "~/utils/db.server";
import { PropertyValidationError } from "~/utils/errors";
import { ImageSchema } from "./Image";
import { FormDataType } from "~/routes/property.add._index";
import {
  AddressData,
  DatabaseSafePropertyData,
  EditablePropertyData,
  editablePropertySchema,
  mutationSafePropertyData,
  MutationSafePropertyData,
  PropertyData,
  PropertyDataStructure,
  PropertyFeeData,
  propertySchema,
} from "./property.zod";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export abstract class PropertyService {
  static createEmptyProperty(): FormDataType {
    return {
      zpid: "0",
      address: {
        streetAddress: "",
        city: "",
        state: "",
        zipcode: "",
      },
      bedrooms: "0",
      bathrooms: "0",
      description: "",
      lotSize: "0",
      livingArea: "0",
      yearBuilt: "0",
      purchaseMethod: "sell",
      price: "0",
      homeType: "",
      latitude: "0",
      longitude: "0",
      livingAreaUnits: "",
      lotAreaUnits: "",
      tax: "0",
      annualHomeownersInsurance: "0",
      zillowLink: "",
      garage: "0",
      parcelId: "",
    };
  }

  static getProperties(): Promise<PropertyData[]> {
    return db.property.findMany({
      include: { images: { where: { active: true } } },
    });
  }

  static getProperty<T extends Prisma.PropertySelect<DefaultArgs>>(
    id: number,
    select: T
  ): Promise<Partial<PropertyData> | null> {
    return db.property.findUnique({
      select,
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
      include: {
        images: {
          where: {
            active: true,
          },
        },
      },
    });
  }

  static async createProperty(
    property: MutationSafePropertyData
  ): Promise<{ id: number }> {
    // validate we have all the required data
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = mutationSafePropertyData.parse(property); // will throw if failed

      // lets tack on the other required properties to create a full property
      // get user from session

      return db.property.create({
        data,
        select: {
          id: true,
        },
      });
    } catch (e) {
      throw new PropertyValidationError({});
    }
  }
  static async updateProperty<T extends EditablePropertyData>(
    property: T
  ): Promise<DatabaseSafePropertyData | void> {
    console.log("property", property);
  }
  abstract deleteProperty(id: number): Promise<void>;

  static transformToPropertyData(property: string) {
    const parsedJson = JSON.parse(property);
    const { address, fees, images, ...rest } = parsedJson;

    const propertyData = {
      ...address,
      ...fees,
      ...rest,
    };
    const data = editablePropertySchema.parse(propertyData);
    return data;
  }
}

// this class takes in the database data object and converts it into a property object
export class DatabaseProperty implements Partial<PropertyDataStructure> {
  id: number | undefined;
  address: AddressData;
  bedrooms: number | undefined;
  bathrooms: number | undefined;
  description: string | undefined;
  lotSize: number | undefined;
  livingArea: number | undefined;
  yearBuilt: number | undefined;
  purchaseMethod: "sell" | "rent" | undefined;
  price: number | undefined;
  homeType: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  livingAreaUnits: string | undefined;
  lotAreaUnits: string | undefined;
  tax: number | undefined;
  annualHomeownersInsurance: number | undefined;
  zillowLink: string | undefined;
  garage: number | undefined;
  parcelId: string | undefined;
  images: ImageSchema[];
  ownerId: number | undefined;
  likes: number[] | undefined;
  likesCount: number | undefined;
  fees: PropertyFeeData;

  constructor(private property: Partial<PropertyData>) {
    this.id = property.id;
    this.address = {
      streetAddress: property.streetAddress || "",
      city: property.city || "",
      state: property.state || "",
      zipcode: property.zipcode || "",
    };
    this.bedrooms = property.bedrooms;
    this.bathrooms = property.bathrooms;
    this.description = property.description;
    this.lotSize = property.lotSize;
    this.livingArea = property.livingArea;
    this.yearBuilt = property.yearBuilt;
    this.purchaseMethod = property.purchaseMethod;
    this.price = property.price;
    this.homeType = property.homeType;
    this.latitude = property.latitude;
    this.longitude = property.longitude;
    this.livingAreaUnits = property.livingAreaUnits;
    this.lotAreaUnits = property.lotAreaUnits;
    this.tax = property.tax;
    this.annualHomeownersInsurance = property.annualHomeownersInsurance;
    this.zillowLink = property.zillowLink || "";
    this.garage = property.garage;
    this.parcelId = property.parcelId;
    this.images = property.images || [];
    this.ownerId = property.ownerId;
    this.likes = property.likes || [];
    this.likesCount = property.likesCount;
    this.fees = {
      hoa: property.hoa,
      management: property.management || 0,
      capex: property.capex || 0,
      vacancy: property.vacancy || 0,
    };
  }
}

export type { PropertyFormData };
