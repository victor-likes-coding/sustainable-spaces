export type authError = {
  email: string;
  password: string;
};

export type TokenPayload = {
  id: number;
  email: string;
  iat: number;
  exp: number;
};
