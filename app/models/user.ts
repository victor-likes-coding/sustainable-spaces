import { userAuthData } from "./user.d";
// import { Property } from "./property";
import { Bank } from "./bank";
import { validateAuth } from "~/utils/helper";

interface iUser {
  id?: string;
  email?: string;
  bank?: Bank;
}

export class User implements iUser {
  bank?: Bank;
  id?: string;
  email?: string;

  constructor({ bank, id, email }: iUser) {
    this.bank = bank;
    this.id = id;
    this.email = email;
  }
}

export abstract class UserService {
  createUser(data: userAuthData) {
    // validate userAuthData
    if (validateAuth(data)) {
      // hash password
      // store data into database
      // return newly created user
    }
  }
}
export type { userAuthData };
