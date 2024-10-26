import { Hono } from 'hono'

// BUILT IN MIDDLEWARE
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'

// API ROUTES
import authApi from "./routes/auth.ts";
import eventApi from "./routes/events.ts";
import channelApi from "./routes/channels.ts";
import settingsApi from "./routes/settings.ts";

// DATABASE SETUP 
import db, { initDatabase } from './database.ts'

initDatabase(db);

const app = new Hono()

// HTTP API

// middlewares
app.use(logger())
app.use(compress())
app.use(cors({
  origin: Deno.env.get('ALLOWED_ORIGINS') || '*',
  allowHeaders: ['Authorization', 'Content-Type', 'X-Api-Key', 'x-api-key'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
// api routes
app.route('/api/v1/auth', authApi)
app.route('/api/v1/events', eventApi)
app.route('/api/v1/channels', channelApi)
app.route('/api/v1/settings', settingsApi)

if (import.meta.main) {
  // Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
  Deno.serve(app.fetch)
}