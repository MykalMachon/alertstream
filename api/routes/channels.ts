import { Hono } from 'hono'
import db from '../database.ts';
import { apiAuthentication } from '../middlewares.ts';

const channelApi = new Hono()

channelApi.use(apiAuthentication);
channelApi.get('/', (c) => {
  const stmt = db.prepare('SELECT * FROM channels');
  const channels = stmt.all();

  return c.json({ channels }, 200);
});

channelApi.get('/:channel_id', (c) => {
  const channel_id = c.req.param('channel_id');

  const stmt = db.prepare('SELECT * FROM channels WHERE id = ?');
  const channel = stmt.get(channel_id);

  if (!channel) {
    return c.json({ message: 'Channel not found' }, 404);
  }

  return c.json({ channel }, 200);
});

channelApi.post('/create', async (c) => {
  const data = await c.req.json();

  if (!data.name) {
    return c.json({ message: 'Channel name is required' }, 400);
  }

  const insertStmt = db.prepare('INSERT INTO channels (name, description) VALUES (?, ?)');
  insertStmt.run(data.name, data.description);

  return c.json(data, 200);
});

channelApi.put('/:channel_id', async (c) => {
  const channel_id = c.req.param('channel_id');
  const data = await c.req.json();

  if (!data.name) {
    return c.json({ message: 'Channel name is required' }, 400);
  }

  if (channel_id === '1') {
    return c.json({ message: 'Cannot update the default channel' }, 400);
  }

  const updateStmt = db.prepare('UPDATE channels SET name = ?, description = ? WHERE id = ?');
  updateStmt.run(data.name, data.description, channel_id);

  return c.json(data, 200);
});

channelApi.delete('/:channel_id', async (c) => {
  const channel_id = c.req.param('channel_id');

  if (!channel_id) {
    return c.json({ message: 'Channel ID is required' }, 400);
  }

  if (channel_id === '1') {
    return c.json({ message: 'Cannot delete the default channel' }, 400);
  }

  const eventsStmt = db.prepare('DELETE FROM events WHERE channel_id = ?');
  eventsStmt.run(channel_id);

  const deleteStmt = db.prepare('DELETE FROM channels WHERE id = ?');
  deleteStmt.run(channel_id);

  return c.json({ message: 'Channel deleted' }, 200);
});



export default channelApi;