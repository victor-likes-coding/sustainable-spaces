import { JwtPayload } from "jsonwebtoken";
import { TokenPayload, authError } from "./helper.d";
import validator from "validator";
import { userAuthData } from "~/models/user";
import { DataValidationEror } from "./errors";

/**
 * Validates a `Auth` object to contain an email and password
 * @param data - an object containing string properties `email` and `password`
 */

export const validateAuth = ({ email, password }: userAuthData) => {
  const errors = {
    email: "",
    password: "",
  };
  if (!email) errors.email = "Email is required";

  if (!password) errors.password = "Password is required";

  if (!validateEmail(email)) errors.email = "Invalid email. Please try again.";

  if (!validatePassword(password))
    errors.password =
      "Invalid password. Please try again. Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.";

  if (errors.email || errors.password)
    throw new DataValidationEror(JSON.stringify(errors));

  return true;
};

export const validateEmail = (email: string) => {
  const [name] = email.split("@");
  return name.length > 2 && validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  return validator.isStrongPassword(password);
};

export const getLoggedInStatus = (payload: TokenPayload) => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    Object.hasOwn(payload, "email")
  ) {
    return true;
  }

  return false;
};
export type { authError, TokenPayload };
