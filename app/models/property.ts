import type { PropertyFormData } from "./property.d";
import { db } from "~/utils/db.server";
import { PropertyValidationError } from "~/utils/errors";
import { ImageSchema } from "./Image";
import { FormDataType } from "~/routes/property.add._index";
import {
  AddressData,
  DatabaseSafePropertyData,
  mutationSafePropertyData,
  MutationSafePropertyData,
  PropertyData,
  PropertyDataStructure,
  propertySchema,
} from "./property.zod";

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

  static getProperty(id: number): Promise<PropertyData | null> {
    return db.property.findUnique({
      where: {
        id,
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
  abstract updateProperty(
    property: unknown
  ): Promise<DatabaseSafePropertyData | void>;
  abstract deleteProperty(id: number): Promise<void>;

  static transformToPropertyData(property: string) {
    const data = propertySchema.parse(JSON.parse(property as string));
    return data;
  }
}

// this class is used for representing a property from the database
export class DatabaseProperty implements PropertyDataStructure {
  id: number;
  purchaseMethod: "rent" | "sell";
  tenantId: number | null | undefined;
  likes: number[];
  likesCount: number;
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
  zillowLink: string | undefined | null;
  garage: number;
  parcelId: string;
  ownerId: number;
  fees: {
    hoa: number | undefined | null;
    management: number;
    capex: number;
    vacancy: number;
  };
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
  };
  updated: Date | string;
  created: Date | string;
  images: ImageSchema[]; // Add the 'images' property
  constructor(data: PropertyData) {
    this.id = data.id;
    this.purchaseMethod = data.purchaseMethod;
    this.tenantId = data.tenantId;
    this.likes = data.likes;
    this.likesCount = data.likesCount;
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
    this.images = data.images; // Assign the 'images' property
  }
}

export type { PropertyFormData };
