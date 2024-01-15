import {
  authUser,
  databaseUser,
  elevatedAuthData,
  userAuthData,
} from "./user.d";
// import { Property } from "./property";
// import { Bank } from "./bank";
import { validateAuth } from "~/utils/helper";
import { PasswordService } from "./password";
import { db } from "~/utils/db.server";

export class User implements authUser {
  [key: string]: number | string | undefined;
  email: string;
  id: number;
  firstName?: string | undefined;
  lastName?: string | undefined;

  constructor({ id, email }: databaseUser) {
    this.id = id;
    this.email = email;
  }
}

export abstract class UserService {
  public static async createUser(data: userAuthData | elevatedAuthData) {
    // validate userAuthData
    if (validateAuth(data)) {
      // return newly created user
      try {
        const newUser = await db.$transaction(async (trx) => {
          // hash password
          const hash = await PasswordService.hashPassword({
            password: data.password,
            saltRounds: 10,
          });
          // store data into database
          const confidentialUser = UserService.createModel(data, hash);
          const user = await trx.user.create({ data: confidentialUser });
          return new User(user);
        });

        return newUser;
      } catch (error) {
        throw new Error("error creating user");
      }
    }
  }

  private static createModel({ email }: userAuthData, hash: string) {
    return {
      email,
      password: hash,
    };
  }
}
export type { userAuthData, elevatedAuthData, databaseUser, authUser };
