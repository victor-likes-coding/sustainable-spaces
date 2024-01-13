import { User } from "./user";

interface iBank {
  id: string;
  name: string;
  balance: number;
  routing: string;
  account: string;
  owner: User;
}

export class Bank implements iBank {
  id: string;
  name: string;
  balance: number;
  routing: string;
  account: string;
  owner: User;

  constructor({ id, name, balance, routing, account, owner }: iBank) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.routing = routing;
    this.account = account;
    this.owner = owner;
  }
}
