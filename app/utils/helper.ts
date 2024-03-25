import { Address, ZillowPropertyData } from "./../models/property.d";
import { TokenPayload, authError } from "./helper.d";
import validator from "validator";
import { userAuthData } from "~/models/user";
import {
  DataValidationEror,
  DpgClientCache,
  PropertyNotFoundError,
  UnauthorizedMutationRequestError,
} from "./errors";
import {
  DatabaseProperty,
  PropertyData,
  PropertyDataStructure,
  PropertyService,
} from "~/models/property";
import { requireToken } from "./sessions.server";
import { Params } from "@remix-run/react";
import invariant from "invariant";
import { Property } from "@prisma/client";

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
    if (!objectData?.props?.pageProps?.componentProps?.gdpClientCache)
      // this is a just in case there's no gdpClientCache
      throw new DpgClientCache();
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterObject(obj: any): Partial<ZillowPropertyData> {
  const filteredObject: Partial<ZillowPropertyData> = {
    garage: 0,
  };
  const dataKeys = Object.keys(obj) as Array<keyof ZillowPropertyData>;
  // filter keys based on zillowPropertyData type only
  const keys = [
    "zpid",
    "yearBuilt",
    "parcelId",
    "lotSize",
    "lotAreaUnits",
    "livingArea",
    "livingAreaUnits",
    "latitude",
    "longitude",
    "homeType",
    "description",
    "bedrooms",
    "bathrooms",
    "timestamp",
    "insurance",
    "annualHomeownersInsurance",
    "zillowLink",
    "city",
    "state",
    "streetAddress",
    "zipcode",
    "price",
    "garage",
  ];

  const addressKeys = ["city", "state", "streetAddress", "zipcode"];

  for (const key of dataKeys) {
    if (keys.includes(key as string)) {
      if (addressKeys.includes(key as string)) {
        filteredObject.address = filteredObject.address || ({} as Address);
        filteredObject.address[key as keyof Address] = obj[key];
      } else {
        filteredObject[key] = obj[key];
      }
    }
  }

  return filteredObject;
}

interface AdditionalMutationData {
  purchaseMethod: "rent" | "sell";
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
  if (
    !objectData ||
    !objectData?.props?.pageProps?.componentProps?.gdpClientCache
  )
    return undefined; // very important we have the dpgClientCache
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

export async function validateAndRetrieveProperty(
  { propertyId }: Params<string>,
  request: Request
): Promise<{ property: PropertyDataStructure; payload: TokenPayload }> {
  invariant(propertyId, "Property ID is required");
  const payload: TokenPayload = (await requireToken(request)) as TokenPayload;
  const id = parseFloat(propertyId);
  const property = await PropertyService.getProperty(id);

  if (!property) {
    throw new PropertyNotFoundError();
  }

  const databaseProperty = new DatabaseProperty(property);
  return { property: databaseProperty, payload };
}

export async function validatePropertyOwner(
  { propertyId }: Params<string>,
  request: Request
) {
  const { property, payload } = await validateAndRetrieveProperty(
    { propertyId },
    request
  );
  if (property.ownerId !== payload.id) {
    throw new UnauthorizedMutationRequestError();
  }

  return { property, payload };
}

export function separateAndCapitalize(str: string) {
  // Split the string at every capital letter
  const words = str.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join all the words back together
  return capitalizedWords.join(" ");
}
