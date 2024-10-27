// relays 
// this api is for creating and triggering relays
// relays send alerts to configured services. 

import { Hono, type Context } from 'hono'
import db from '../database.ts';
import { apiAuthentication } from "../middlewares.ts";

const relayApi = new Hono()

relayApi.use(apiAuthentication);

relayApi.get('/', (c) => {
  // return all relays that the user has configured 
  const stmt = db.prepare('SELECT * FROM relays');
  const relays = stmt.all();

  return c.json(relays, 200);
})

relayApi.post('/', async (c) => {
  // create a new relay
  const data = await c.req.json();
  const stmt = db.prepare('INSERT INTO relays (name, type, config) VALUES (?, ?, ?)');
  stmt.run(data.name, data.type, JSON.stringify(data.config));

  return c.json(data, 200);
});

relayApi.get('/:relay_id', (c: Context) => {
  const relay_id = c.req.param('relay_id');
  const stmt = db.prepare('SELECT * FROM relays WHERE id = ?');
  const relay = stmt.get(relay_id);

  return c.json(relay, 200);
});

relayApi.put('/:relay_id', async (c: Context) => {
  const relay_id = c.req.param('relay_id');
  const data = await c.req.json();
  const stmt = db.prepare('UPDATE relays SET name = ?, type = ?, config = ? WHERE id = ?');
  stmt.run(data.name, data.type, JSON.stringify(data.config), relay_id);

  return c.json(data, 200);
});

relayApi.delete('/:relay_id', (c: Context) => {
  const relay_id = c.req.param('relay_id');
  const stmt = db.prepare('DELETE FROM relays WHERE id = ?');
  stmt.run(relay_id);

  return c.json({ message: 'Deleted' }, 200);
});

relayApi.post('/:relay_id/trigger', (c: Context) => {
  const relay_id = c.req.param('relay_id');
  const stmt = db.prepare('SELECT * FROM relays WHERE id = ?');
  const relay = stmt.get(relay_id);

  if (!relay) return c.json({ message: 'Relay not found' }, 404);

  // trigger the relay
  // this is where the magic happens
  // we will send the alert to the configured service
  // for now, we will just return the relay data


  return c.json(relay, 200);
});

export default relayApi;

// create a new relay


