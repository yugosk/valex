import Cryptr from "cryptr";
import bcrypt from "bcrypt";

const cryptr = new Cryptr("secret");

export function encryptSecurityCode(securityCode: string): string {
  return cryptr.encrypt(securityCode);
}

export function decryptSecurityCode(encryptedCVV: string): string {
  return cryptr.decrypt(encryptedCVV);
}

export function encryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function compareHash(password: string, hash: any): boolean {
  return bcrypt.compareSync(password, hash);
}
