export interface userAuthData {
  [key: string]: FormDataEntryValue | undefined | boolean;
  email: string;
  password: string;
  adminCode?: string;
}

export interface elevatedAuthData extends userAuthData {
  admin?: boolean;
}
