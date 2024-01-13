export type hashConfig = {
  password: string;
  saltRounds: number;
};

export type checkHashConfig = {
  password: string;
  hash: string;
};
