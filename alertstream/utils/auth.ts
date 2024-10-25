import { hash, verify } from "jsr:@ts-rex/bcrypt"

export const hashPassword = (password: string) => {
  const hashedPass = hash(password);
  return hashedPass
}

export const comparePasswordToHash = (password: string, passwordHash: string) => {
  return verify(password, passwordHash)
}