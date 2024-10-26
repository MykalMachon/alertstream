import { assertEquals } from "@std/assert";
import { comparePasswordToHash, hashPassword } from "./auth.ts";

Deno.test(function hashTest() {
  const pass = 'this-is-a-password';
  const hashOne = hashPassword(pass);
  assertEquals(true, comparePasswordToHash(pass, hashOne))
});