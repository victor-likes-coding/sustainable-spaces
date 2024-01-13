import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );

  await Promise.all(
    getProperties().map((property) => {
      return db.property.create({ data: property });
    })
  );
}

seed();

function getUsers() {
  return [
    {
      email: "mike@microsoft.com",
      password: "password",
    },
    {
      email: "jake@statefarm.com",
      password: "password",
    },
  ];
}

function getProperties() {
  return [
    {
      address: "123 Main Street",
      city: "San Diego",
      state: "CA",
      zip: 92101,
      price: 1000000,
      beds: 3,
      baths: 2,
      sqft: 2000,
      tax: 0,
      hoa: 0,
      insurance: 0,
      rent: 0,
      payment: 0,
      garage: 2,
      ownerId: 1,
      tenantId: null,
      likes: [],
      likesCount: 0,
      longitude: 0,
      latitude: 0,
      description: "This is a description",
      allowRentOption: false,
      year: 1935,
    },
    {
      address: "456 Main Street",
      city: "San Diego",
      state: "CA",
      zip: 92101,
      price: 2000000,
      beds: 3,
      baths: 2,
      sqft: 2000,
      tax: 0,
      hoa: 0,
      insurance: 0,
      rent: 0,
      payment: 0,
      garage: 2,
      ownerId: 1,
      tenantId: null,
      likes: [],
      likesCount: 0,
      longitude: 0,
      latitude: 0,
      description: "This is a description",
      allowRentOption: false,
      year: 1935,
    },
    {
      address: "789 Main Street",
      city: "San Diego",
      state: "CA",
      zip: 92101,
      price: 3000000,
      beds: 3,
      baths: 2,
      sqft: 2000,
      tax: 0,
      hoa: 0,
      insurance: 0,
      rent: 0,
      payment: 0,
      garage: 2,
      ownerId: 1,
      tenantId: null,
      likes: [],
      likesCount: 0,
      longitude: 0,
      latitude: 0,
      description: "This is a description",
      allowRentOption: false,
      year: 1935,
    },
  ];
}
