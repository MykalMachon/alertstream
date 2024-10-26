import { Hono, type Context } from 'hono'
import db from '../database.ts';

import { hashApiKey } from '../utils/auth.ts';
import { apiAuthentication } from '../middlewares.ts';

const eventApi = new Hono()

eventApi.get('/', (c) => c.text('Hello from /api/v1/events!'))

eventApi.use('/:channel_id', apiAuthentication);
eventApi.get('/:channel_id', (c: Context) => {
  const channel_id = c.req.param('channel_id');
  const stmt = db.prepare('SELECT * FROM events WHERE channel_id = ?');
  const events = stmt.all(channel_id);
  return c.json(events, 200);
});

eventApi.post('/create', async (c: Context) => {
  // check for API key
  const apiKey = c.req.header('x-api-key');
  if (!apiKey) return c.json({ message: 'Unauthorized' }, 401);

  // check if the api key is in the database
  const hashedApiKey = await hashApiKey(apiKey);
  const getApiKeyStmt = db.prepare('SELECT * FROM api_keys WHERE api_key = ?');
  const apiKeyData = getApiKeyStmt.get(hashedApiKey);

  if (!apiKeyData) return c.json({ message: 'Invalid API Key' }, 401);
  
  const data = await c.req.json();

  if (!data.channel_id) {
    data.channel_id = 1; // set to default
  }

  // create the event in the database 
  const insertStmt = db.prepare('INSERT INTO events (channel_id, metadata) VALUES (?, ?)');
  insertStmt.run(data.channel_id, JSON.stringify(data.metadata));

  return c.json(data, 200);
})

export default eventApi;