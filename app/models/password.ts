import { checkHashConfig, hashConfig } from "./password.d";
import bcrypt from "bcryptjs";
export abstract class PasswordService {
  public static async hashPassword(config: hashConfig) {
    const salt = await bcrypt.genSalt(config.saltRounds);
    return await bcrypt.hash(config.password, salt);
  }

  public static async checkPassword(config: checkHashConfig) {
    return await bcrypt.compare(config.password, config.hash);
  }
}

export type { hashConfig, checkHashConfig };
