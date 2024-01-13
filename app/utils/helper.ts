import validator from "validator";
import { userAuthData } from "~/models/user";

/**
 * Validates a `Auth` object to contain an email and password
 * @param data - an object containing string properties `email` and `password`
 */

export const validateAuth = ({ email, password }: userAuthData) => {
  return (
    !!email && !!password && validateEmail(email) && validatePassword(password)
  );
};

export const validateEmail = (email: string) => {
  const [name] = email.split("@");
  return name.length > 2 && validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  return validator.isStrongPassword(password);
};
