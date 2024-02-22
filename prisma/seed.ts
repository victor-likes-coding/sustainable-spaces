import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );

  // await Promise.all(
  //   getProperties().map((property) => {
  //     return db.property.create({ data: property });
  //   })
  // );
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

// function getProperties() {
//   return [

//   ];
// }
