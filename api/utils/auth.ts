import { encodeHex } from "@std/encoding/hex";
import { hash, verify } from "jsr:@ts-rex/bcrypt"

export const hashApiKey = async (apiKey: string) => {
  const apiKeyBuffer = new TextEncoder().encode(apiKey);
  const apiKeyHashBuffer = await crypto.subtle.digest('SHA-256', apiKeyBuffer); 
  const hashedApiKey = encodeHex(apiKeyHashBuffer);
  return hashedApiKey;
}

export const hashPassword = (password: string) => {
  const hashedPass = hash(password);
  return hashedPass
}

export const comparePasswordToHash = (password: string, passwordHash: string) => {
  return verify(password, passwordHash)
}