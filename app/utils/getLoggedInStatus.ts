import { TokenPayload } from "./helper.d";

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
