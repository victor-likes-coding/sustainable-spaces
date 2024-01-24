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
import {
  DatabaseCreationServiceError,
  ExistingUserError,
  HashingPasswordError,
  UserNotFoundError,
} from "~/utils/errors";

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
  public static async checkForExistingUser(email: string) {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) throw new ExistingUserError();
  }

  /**
   * The register function will validate the data sent to it and check for existing users. Once the checks are done, it will create a new user in the database and return it.
   * @param data - an object containing string properties `email` and `password` or `adminCode`
   * @returns {User}
   */

  public static async register(data: userAuthData | elevatedAuthData) {
    // validate userAuthData
    validateAuth(data); // this will throw an error or simply do nothing // should be caught when calling this function a try/catch where this method was called.

    // check if user already exists
    await UserService.checkForExistingUser(data.email);
    const user = await UserService.createUser(data);
    return user;
  }

  public static async getUserById(id: number | string) {
    const user = await db.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) throw new UserNotFoundError("User not found");
    return new User(user);
  }

  public static async createUser(data: userAuthData | elevatedAuthData) {
    // return newly created user
    try {
      const newUser = await db.$transaction(async (trx) => {
        // hash password
        try {
          const hash = await PasswordService.hashPassword({
            password: data.password,
            saltRounds: 10,
          });

          // store data into database
          const confidentialUser = UserService.createModel(data, hash);
          const user = await trx.user.create({ data: confidentialUser });
          return new User(user);
        } catch (error) {
          throw new HashingPasswordError();
        }
      });

      return newUser;
    } catch (error) {
      if (error instanceof HashingPasswordError) throw error;
      throw new DatabaseCreationServiceError();
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
