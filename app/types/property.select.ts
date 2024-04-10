import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const commonSelectFields: Prisma.PropertySelect<DefaultArgs> = {
  streetAddress: true,
  city: true,
  state: true,
  zipcode: true,
  bedrooms: true,
  bathrooms: true,
  livingArea: true,
  price: true,
  purchaseMethod: true,
  description: true,
};
// select the fields that are required for the property form
export const propertyFormSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...commonSelectFields,
  lotSize: true,
  garage: true,
  yearBuilt: true,
};

// select the fields that are required for the edit form
export const editPropertyFormSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...propertyFormSelect,
  tax: true,
  annualHomeownersInsurance: true,
  hoa: true,
  management: true,
  capex: true,
  vacancy: true,
};

export const editFormPermissionSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...editPropertyFormSelect,
  ownerId: true,
};

export const singlePropertyDefaultSelect: Prisma.PropertySelect<DefaultArgs> = {
  id: true,
  tax: true,
  annualHomeownersInsurance: true,
  ownerId: true,
  ...commonSelectFields,
};

// select the fields that are required for viewing a single property
export const singlePropertyDefaultWithImage: Prisma.PropertySelect<DefaultArgs> =
  {
    images: {
      where: {
        active: true,
      },
    },
    ...singlePropertyDefaultSelect,
  };
