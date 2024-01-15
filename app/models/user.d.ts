export interface userAuthData {
  [key: string]: FormDataEntryValue | undefined | boolean;
  email: string;
  password: string;
  adminCode?: string;
}

export interface elevatedAuthData extends userAuthData {
  admin?: boolean;
}

export interface authUser {
  [key: string]: number | string | undefined;
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface databaseUser {
  id: number;
  password: string;
  email: string;
  updated: Date;
  created: Date;
}
