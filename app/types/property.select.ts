import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const withActiveImageSelect: Prisma.PropertySelect<DefaultArgs> = {
  images: {
    where: {
      active: true,
    },
  },
};

export const withPropertyOwnerSelect: Prisma.PropertySelect<DefaultArgs> = {
  ownerId: true,
};

const withAddressSelect: Prisma.PropertySelect<DefaultArgs> = {
  streetAddress: true,
  city: true,
  state: true,
  zipcode: true,
};

const withFinancialsSelect: Prisma.PropertySelect<DefaultArgs> = {
  tax: true,
  annualHomeownersInsurance: true,
  monthlyHoaFee: true,
  management: true,
  capex: true,
  vacancy: true,
};

const commonSelectFields: Prisma.PropertySelect<DefaultArgs> = {
  ...withAddressSelect,
  bedrooms: true,
  bathrooms: true,
  livingArea: true,
  price: true,
  purchaseMethod: true,
  description: true,
};
// select the fields that are required for the property form
const propertyFormSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...commonSelectFields,
  lotSize: true,
  garage: true,
  yearBuilt: true,
};

// select the fields that are required for the edit form
const editPropertyFormSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...propertyFormSelect,
  ...withFinancialsSelect,
  homeType: true,
  latitude: true,
  longitude: true,
};

export const editFormPermissionSelect: Prisma.PropertySelect<DefaultArgs> = {
  ...editPropertyFormSelect,
  ...withPropertyOwnerSelect,
  ...withActiveImageSelect,
};

export const singlePropertyDefaultSelect: Prisma.PropertySelect<DefaultArgs> = {
  id: true,
  tax: true,
  annualHomeownersInsurance: true,
  ...withPropertyOwnerSelect,
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
