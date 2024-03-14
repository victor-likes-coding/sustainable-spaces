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

export type JsonifyObject<T> = {
  [K in keyof T]: Jsonify<T[K]>;
};

export type Jsonify<T> = T extends string | number | boolean | null
  ? T
  : T extends object
  ? JsonifyObject<T>
  : never;
