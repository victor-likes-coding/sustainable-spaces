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
  | "30000";

// ? TODO: Split errors into AuthErrors, PropertyErrors, and DatabaseErrors
// ? TODO: combine error strings and error name into single object
class BaseError extends Error {
  // 1xxxx errors are auth related
  // 2xxxx errors are property related
  // 3xxxx errors are database related
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
    30000: "The server is currently down. Please try again.",
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
  constructor(
    data: BaseErrorProps = {
      code: "10000",
    }
  ) {
    super(data);
    this.name = "ExistingUserError";
  }
}

export class UserNotFoundError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "10010",
    }
  ) {
    super(data);
    this.name = "UserNotFoundError";
  }
}

export class IncorrectEmailOrPasswordError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "10011",
    }
  ) {
    super(data);
    this.name = "IncorrectEmailOrPasswordError";
  }
}

export class HashingPasswordError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "10100",
    }
  ) {
    super(data);
    this.name = "HashingPasswordError";
  }
}

export class DatabaseCreationServiceError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "10101",
    }
  ) {
    super(data);
    this.name = "DatabaseCreationServiceError";
  }
}

export class DataValidationEror extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "10001",
    }
  ) {
    super(data);
    this.name = "DataValidationEror";
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
    console.log(response);
  }
}

export class PropertyNotFoundError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "20000",
    }
  ) {
    super(data);
    this.name = "PropertyNotFoundError";
  }
}

export class DatabaseConnectionError extends BaseError {
  constructor(
    data: BaseErrorProps = {
      code: "30000",
    }
  ) {
    super(data);
    this.name = "DatabaseConnectionError";
  }
}

export const errors = {};
