import { userAuthData } from "./user.d";
// import { Property } from "./property";
import { Bank } from "./bank";
import { validateAuth } from "~/utils/helper";
import { PasswordService } from "./password";

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
  public static async createUser(data: userAuthData) {
    // validate userAuthData
    if (validateAuth(data)) {
      // hash password
      const hash = await PasswordService.hashPassword({
        password: data.password,
        saltRounds: 10,
      });
      // store data into database
      const user = UserService.createModel(data, hash);

      // return newly created user
    }
  }

  private static createModel({ email }: userAuthData, hash: string) {
    return {
      email,
      password: hash,
    };
  }
}
export type { userAuthData };
