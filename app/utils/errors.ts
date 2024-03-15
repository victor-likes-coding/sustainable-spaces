type BaseErrorProps = {
  message?: string;
  code?: ErrorCodes;
};

type ErrorCodes =
  | "10000"
  | "10010"
  | "10011"
  | "10100"
  | "10101"
  | "10001"
  | "20000"
  | "20001"
  | "20002"
  | "30000"
  | "60000";

// ? TODO: Split errors into AuthErrors, PropertyErrors, and DatabaseErrors
// ? TODO: combine error strings and error name into single object
class BaseError extends Error {
  // 1xxxx errors are auth related
  // 2xxxx errors are property related
  // 3xxxx errors are database related
  // 6xxxx errors are zillow related
  protected errors: Record<ErrorCodes, string> = {
    10000: "Unable to create user.",
    10010: "User not found.",
    10011: "Incorrect email or password.",
    10100: "Server experienced an error processing your password",
    10101:
      "Server experienced an error in creating and saving the user to the database",
    10001: "The email or password data given is not valid.",
    20000:
      "Failed to locate a listing for this property. Please enter manually.",
    20001:
      "An error occurred while processing the property data. Please try again.",
    20002:
      "A listing for this address already exists. You may report the property on that property page. You'll be redirected in 3 seconds.",
    30000: "The server is currently down. Please try again.",
    60000: "GdpCacheNotDetected: GdpCache not detected in the HTML given.",
  };
  constructor({ message, code }: BaseErrorProps) {
    if (!message) {
      message = "[11000]: An unknown error occurred.";
    }
    super(message);
    this.name = "BaseErrors";
    if (code) {
      this.message = this.errors[code] || message;
    }
  }
}

export class ExistingUserError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "ExistingUserError";
    this.message = this.errors["10000"];
  }
}

export class UserNotFoundError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "UserNotFoundError";
    this.message = this.errors["10010"];
  }
}

export class IncorrectEmailOrPasswordError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "IncorrectEmailOrPasswordError";
    this.message = this.errors["10011"];
  }
}

export class HashingPasswordError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "HashingPasswordError";
    this.message = this.errors["10100"];
  }
}

export class DatabaseCreationServiceError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "DatabaseCreationServiceError";
    this.message = this.errors["10101"];
  }
}

export class DataValidationEror extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "DataValidationEror";
    this.message = this.errors["10001"];
  }
}

type ZillowResponseErrorProps = {
  message?: string;
  response: Response;
};

export class ZillowResponseError extends Error {
  constructor({ message, response }: ZillowResponseErrorProps) {
    if (!message) {
      message = "Failed to fetch data from Zillow API";
    }
    super(message + ` (${response.status} ${response.statusText})`);
    this.name = "ZillowResponseError";
  }
}

export class PropertyNotFoundError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "PropertyNotFoundError";
    this.message = this.errors["20000"];
  }
}

export class PropertyValidationError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "PropertyValidationError";
    this.message = this.errors["20001"];
  }
}

type WithPropertyId = {
  propertyId?: number | undefined;
};

export class PropertyAlreadyExistsError
  extends BaseError
  implements WithPropertyId
{
  propertyId?: number;
  constructor(data: BaseErrorProps & WithPropertyId = {}) {
    super(data);
    this.name = "PropertyAlreadyExistsError";
    this.propertyId = data.propertyId;
    this.message = this.errors["20002"];
  }
}

export class DatabaseConnectionError extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "DatabaseConnectionError";
    this.message = this.errors["30000"];
  }
}

export class DpgClientCache extends BaseError {
  constructor(data: BaseErrorProps = {}) {
    super(data);
    this.name = "DpgClientCache";
    this.message = this.errors["60000"];
  }
}

export const errors = {};
