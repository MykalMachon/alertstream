import { Hono, type Context } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'

import { encode } from "@gz/jwt";
import { encodeHex } from "jsr:@std/encoding/hex";

import db from "../database.ts";
import { apiAuthentication } from "../middlewares.ts";
import { comparePasswordToHash, hashApiKey, hashPassword } from "../utils/auth.ts";

// TODO: LOOK AT THIS MIDDLEWARE
// https://hono.dev/docs/middleware/builtin/jwt

const authApi = new Hono()

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at: string;
}

authApi.get('/', (c) => c.text('Hello from /api/v1/auth!'))

authApi.post('/login', async (c) => {
  const data = await c.req.json();
  const username = data.username;
  const password = data.password;

  const userStmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = userStmt.get<User>(username);

  if (!user) {
    return c.json({
      message: 'email or password is wrong, try again!'
    }, 401);
  }

  if (comparePasswordToHash(password, user.password)) {
    // create a jwt 
    const { password: _, ...jwtData } = user;
    const token = await encode(jwtData, Deno.env.get('JWT_SECRET')!, { algorithm: 'HS256' })

    // set the cookie 
    setCookie(c, 'auth_token', token, {
      secure: Deno.env.get('DENO_ENV') === 'prod' ? true : false,
      httpOnly: true,
      sameSite: 'Strict',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    })

    return c.json({
      auth_token: token,
    }, 200)
  } else {
    return c.json({
      message: 'email or password is wrong, try again!'
    }, 401);
  }
})

authApi.get('/logout', (c) => {
  deleteCookie(c, 'auth_token')
  return c.json({
    "message": "cookie removed; you're logged out son!"
  }, 200)
})

// User info
authApi.use('/me', apiAuthentication)
authApi.get('/me', (c: Context) => {
  try {
    const user = c.get('auth_user');
    return c.json(user, 200);
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Invalid token' }, 401);
  }
})

// API Keys
authApi.use('/apikey', apiAuthentication)
authApi.get('/apikey', (c: Context) => {
  const user = c.get('auth_user') as User;

  const apiKeysStmt = db.prepare('SELECT * FROM api_keys WHERE user_id = ?');
  const apiKeys = apiKeysStmt.all(user.id);

  return c.json({ api_keys: apiKeys }, 200);
})

authApi.post('/apikey', async (c: Context) => {
  // check if the user is authenticated
  const user = c.get('auth_user') as User;

  // if the user is authenticated, create a new API key scoped to a channel
  const apiKey = `as.${crypto.randomUUID()}`; // Generate a unique API key

  // hash the api key with a simple hash 
  const hashedApiKey = await hashApiKey(apiKey);

  // insert the API key into the database
  const insertStmt = db.prepare('INSERT INTO api_keys (user_id, api_key, created_at) VALUES (?, ?, ?)');
  insertStmt.run(user.id, hashedApiKey, new Date().toISOString());

  // return the API key to the user
  return c.json({ api_key: apiKey }, 201);
})

authApi.delete('/apikey', async (c: Context) => {
  try {
    const user = c.get('auth_user') as User;

    const data = await c.req.json();
    const apiKey = data['api_key_id'];

    const deleteStmt = db.prepare('DELETE FROM api_keys WHERE user_id = ? AND id = ?');
    deleteStmt.run(user.id, apiKey);

    return c.json({ message: 'Succesfully deleted API key' }, 200);
  } catch (_) {
    return c.json({ message: 'Failed to delete API key' }, 401);
  }
})

export default authApi;