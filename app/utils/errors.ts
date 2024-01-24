export class ExistingUserError extends Error {
  constructor(message: string = "Unable to create user.") {
    super(message);
    this.name = "ExistingUserError";
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string = "User not found.") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class HashingPasswordError extends Error {
  constructor(
    message: string = "Server experienced an error processing your password"
  ) {
    super(message);
    this.name = "HashingPasswordError";
  }
}

export class DatabaseCreationServiceError extends Error {
  constructor(
    message: string = "Server experienced an error in creating and saving the user to the database"
  ) {
    super(message);
    this.name = "DatabaseCreationServiceError";
  }
}

export class DataValidationEror extends Error {
  constructor(
    message: string = "The email or password data given is not valid."
  ) {
    super(message);
    this.name = "DataValidationEror";
  }
}
