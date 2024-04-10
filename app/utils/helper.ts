import { ZillowPropertyData } from "./../models/property.d";
import { TokenPayload, authError } from "./helper.d";
import validator from "validator";
import { authObject, authSchema, userAuthData } from "~/models/user";
import {
  DataValidationEror,
  PropertyNotFoundError,
  UnauthorizedMutationRequestError,
} from "./errors";
import { DatabaseProperty, PropertyService } from "~/models/property";
import { requireToken } from "./sessions.server";
import { Params } from "@remix-run/react";
import invariant from "invariant";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { filterObject } from "./filterObject";
import { getObjectData } from "./getObjectData";

/**
 * Validates a `Auth` object to contain an email and password
 * @param data - an object containing string properties `email` and `password`
 */
type ErrorKeys = "email" | "password";

type ErrorObject = Record<ErrorKeys, string>;

export const validateAuth = ({ email, password }: userAuthData) => {
  const errs: ErrorObject = {
    email: "",
    password: "",
  };

  const data = authSchema.safeParse({ email, password });

  if (!data.success) {
    const {
      error: { errors },
    } = data;

    for (const error of errors) {
      const { message, path } = error;
      if (path && path.length > 0 && typeof path[0] === "string") {
        const key = path[0] as ErrorKeys;
        errs[key] = message;
      }
    }

    throw new DataValidationEror({
      message: JSON.stringify(errs),
      errs,
    });
  }

  return true;
};

export const validateEmail = (email: string) => {
  const [name] = email.split("@");
  return name.length > 2 && validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  return validator.isStrongPassword(password);
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

type dCache = {
  [key: string]: {
    property: unknown;
  };
};

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
  request: Request,
  select: Prisma.PropertySelect<DefaultArgs>
): Promise<{
  property: DatabaseProperty;
  payload: TokenPayload;
}> {
  invariant(propertyId, "Property ID is required");
  const payload: TokenPayload = (await requireToken(request)) as TokenPayload;
  const id = parseFloat(propertyId);
  const property = await PropertyService.getProperty(id, select);

  if (!property) {
    throw new PropertyNotFoundError();
  }

  const databaseProperty = new DatabaseProperty(property);
  return { property: databaseProperty, payload };
}

export async function validatePropertyOwner(
  { propertyId }: Params<string>,
  request: Request,
  select: Prisma.PropertySelect<DefaultArgs>
) {
  const { property, payload } = await validateAndRetrieveProperty(
    { propertyId },
    request,
    select
  );
  if (property.ownerId !== payload.id) {
    throw new UnauthorizedMutationRequestError();
  }

  return { property, payload };
}

export function prepareFormData<T>(data: T, fileData: FileList | null) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  // append all files to the form data
  if (fileData) {
    for (let i = 0; i < fileData.length; i++) {
      formData.append("files", fileData[i]);
    }
  }

  return formData;
}

export function handleFileRemoval(
  files: FileList | null,
  index: number
): DataTransfer | null {
  if (files) {
    const newFiles = Array.from(files);
    const dataTransfer = new DataTransfer();
    newFiles.splice(index, 1); // modifies the array directly
    newFiles.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer;
  }
  return null;
}

export function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>,
  files: FileList | null
) {
  const newFiles = event.target.files;
  const dataTransfer = new DataTransfer();

  // add existing files
  if (files) {
    Array.from(files).forEach((file) => dataTransfer.items.add(file));
  }

  if (newFiles) {
    Array.from(newFiles).forEach((file) => dataTransfer.items.add(file));
  }

  return dataTransfer;
}
