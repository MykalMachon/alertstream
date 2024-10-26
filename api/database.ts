import { Database } from "jsr:@db/sqlite";
import { hashPassword } from "./utils/auth.ts";

const db = new Database("_data/alertstream.db");

// setup for maximum speed!
db.exec("pragma journal_mode = WAL");
db.exec("pragma synchronous = NORMAL");
db.exec("pragma temp_store = MEMORY");
db.exec("pragma cache_size = -2000");
db.exec("pragma locking_mode = EXCLUSIVE");

export default db;

export const initDatabase = (db: Database) => {
  // create tables if they don't exist yet
  // TODO: some sort of migration situation needs to happen...
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `);

  // setup a channels table for the events to sit in
  db.exec(`
  CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `);

  // setup an events table that will contain all the json metadata for events
  // each event will be tied to a channel in a many to one relationship.
  db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id INTEGER NOT NULL,
    metadata TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id)
  )
  `);

  // setup a settings table that is a key value store with some default values
  db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
  `);

  db.exec(`
  INSERT OR IGNORE INTO settings (key, value) VALUES
  ('allowed_origins', '*'),
  ('retention_period_days', '30')
  `);

  // create an api_keys table for storing API keys
  db.exec(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // seed the database
  const adminUser = Deno.env.get('ADMIN_USER');
  const adminPass = Deno.env.get('ADMIN_PASS');

  if (adminUser && adminPass) {
    const hashedPassword = hashPassword(adminPass)
    db.exec(`
    INSERT OR IGNORE INTO users(username, password, role) VALUES
    ('${adminUser}', '${hashedPassword}', 'admin')
    `);
  }

  // create a default channel
  db.exec(`
  INSERT OR IGNORE INTO channels(id, name, description) VALUES
  (1, 'default', 'The default channel for all events')
  `);
}