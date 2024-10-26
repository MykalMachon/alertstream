import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { decode } from "@gz/jwt";

import { createMiddleware } from "hono/factory";

/**
 * gets the token from the hono context 
 * if it exists. if it doesn't exist, it
 * returns null.
 * 
 * @param c {Context} hono request context
 * @returns returns token from the context
 */
const getTokenFromContext = (c: Context) => {
  const authHeader = c.req.header('Authorization')
  const cookie = getCookie(c, 'auth_token');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookie) {
    token = cookie;
  }

  return token;
}

export const apiAuthentication = createMiddleware(async (c: Context, next: Next) => {
  const token = getTokenFromContext(c);
  if (!token) return c.json({ message: 'Unauthorized' }, 401);

  // decode the token 
  try {
    const user = await decode(token, Deno.env.get('JWT_SECRET')!);
    c.set('auth_user', user);
    c.set('auth_token', token);
  } catch (_) {
    return c.json({ message: 'Invalid token' }, 401);
  }

  await next();
})