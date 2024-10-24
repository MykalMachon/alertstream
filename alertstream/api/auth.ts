import { Hono } from 'hono'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'

import { encode, decode } from "@gz/jwt";

import db from "../database.ts";
import { comparePasswordToHash, hashPassword } from "../auth.ts";

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

authApi.post('/logout', (c) => {
  deleteCookie(c, 'auth_token')
  return c.json({
    "message": "cookie removed; you're logged out son!"
  }, 200)
})

// User info
authApi.get('/me', async (c) => {
  // returns user info
  const authHeader = c.req.header('Authorization')
  const cookie = getCookie(c, 'auth_token');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookie) {
    token = cookie;
  }

  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const decoded = await decode(token, Deno.env.get('JWT_SECRET')!);
    return c.json(decoded, 200);
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Invalid token' }, 401);
  }
})

// API Keys
authApi.post('/apikey', async (c) => {
  // check if the user is authenticated
  const authHeader = c.req.header('Authorization')
  const cookie = getCookie(c, 'auth_token');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookie) {
    token = cookie;
  }

  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    await decode(token, Deno.env.get('JWT_SECRET')!);
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Invalid token' }, 401);
  }

  // if the user is authenticated, create a new API key scoped to a channel
  const apiKey = crypto.randomUUID(); // Generate a unique API key
  // const hashedApiKey = hashPassword(apiKey)

  // TODO store the API key in the api_keys table; hash the value
  // const insertStmt = db.prepare('INSERT INTO api_keys (user_id, api_key, created_at) VALUES (?, ?, ?)');
  // insertStmt.run(decoded.id, hashedApiKeyHex, new Date().toISOString());

  // return the API key to the user
  return c.json({ api_key: apiKey }, 201);
})


authApi.delete('/apikey/', (c) => c.json({ message: 'stub' }))

export default authApi;