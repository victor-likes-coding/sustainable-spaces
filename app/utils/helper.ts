import { ZillowPropertyData } from "./../models/property.d";
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
    throw new DataValidationEror({ message: JSON.stringify(errors) });

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

export const createZillowUrl = (address: string | undefined | null) => {
  // https://www.zillow.com/homes/6803-119th-Pl-Largo,-FL-33773_rb/
  // turn 6803 119th Place North, Largo, FL, USA into 6803-119th-Place-North-Largo,-FL-USA
  if (!address) return;
  const modifiedAddress = modifyAddress(address);
  const url = `https://www.zillow.com/homes/${modifiedAddress}_rb/`;
  return url;
};

export const modifyAddress = (address: string) => {
  return address.split(" ").join("-");
};

export function getStartingIndex(html: string, pattern: string) {
  return html.indexOf(pattern) + pattern.length;
}

function findClosingBracket(text: string) {
  let inQuotes = false;
  let bracketCount = 0;
  let closingIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "{" && !inQuotes) {
      bracketCount++;
    } else if (char === "}" && !inQuotes) {
      bracketCount--;
      if (bracketCount === 0) {
        closingIndex = i;
        break;
      }
    }
  }

  return closingIndex;
}

function getObjectData(html: string, startingIndex: number) {
  const narrowedData = html.substring(startingIndex); // this starts our object
  const closingIndex = findClosingBracket(narrowedData);
  const stringifiedObjectData = narrowedData.substring(0, closingIndex + 1);
  try {
    const objectData = JSON.parse(stringifiedObjectData);
    return objectData;
  } catch (err) {
    return;
  }
}

type dCache = {
  [key: string]: {
    property: unknown;
  };
};

type Address = {
  city: string;
  state: string;
  streetAddress: string;
  zipcode: string;
};

interface ZillowPropertyData {
  zpid: number;
  yearBuilt: number;
  parcelId: string;
  lotSize: number;
  lotAreaUnit: string;
  livingArea: number;
  livingAreaUnit: string;
  latitude: number;
  longitude: number;
  homeType: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  address: Address;
  timestamp?: string;
  insurance: number;
  tax?: number;
  annualHomeownersInsurance: number;
  zillowLink?: string;
}

function filterObject(obj: any): Partial<ZillowPropertyData> {
  const filteredObject: Partial<ZillowPropertyData> = {};
  const interfaceKeys = Object.keys(obj) as Array<keyof ZillowPropertyData>;

  for (const key of interfaceKeys) {
    if (key in obj) {
      filteredObject[key] = obj[key];
    }
  }

  return filteredObject;
}

interface AdditionalMutationData {
  purchaseMethod: "rent" | "sell";
  price: number;
}
function getPropertyData(
  dpgClientCache: dCache
): ZillowPropertyData | undefined {
  if (!dpgClientCache || typeof dpgClientCache !== "object") return;

  const dynamicKey = Object.keys(dpgClientCache)[0];
  const { property } = dpgClientCache[dynamicKey];
  const propertyData = filterObject(property);
  return propertyData as ZillowPropertyData;
}

export function getZillowDataFromHtml(html: string, pattern: string) {
  const startIndex = getStartingIndex(html, pattern);

  // reduce the string so we're only looking at the start of the json object
  const objectData = getObjectData(html, startIndex);
  if (!objectData) return;
  const dpgClientCache =
    objectData?.props?.pageProps?.componentProps?.gdpClientCache;
  const zillowData = JSON.parse(dpgClientCache);

  return getPropertyData(zillowData);
}

export type {
  authError,
  TokenPayload,
  ZillowPropertyData,
  AdditionalMutationData,
};
