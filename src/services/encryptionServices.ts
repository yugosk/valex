import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");

export function encryptSecurityCode(securityCode: string) {
  return cryptr.encrypt(securityCode);
}
