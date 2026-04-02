require('dotenv').config({ path: '../.env' });
const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id            SERIAL PRIMARY KEY,
        first_name    TEXT NOT NULL,
        last_name     TEXT NOT NULL,
        email         TEXT NOT NULL,
        phone         TEXT,
        type          TEXT NOT NULL,
        guests        TEXT,
        date_location TEXT,
        message       TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ inquiries table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            SERIAL PRIMARY KEY,
        username      TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ admin_users table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token      TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
      );
    `);
    console.log('✓ admin_sessions table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL UNIQUE,
        category   TEXT NOT NULL,
        unit       TEXT NOT NULL,
        quantity   DECIMAL(10,2) NOT NULL DEFAULT 0,
        par_level  DECIMAL(10,2) NOT NULL DEFAULT 0,
        notes      TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
    `);
    console.log('✓ inventory table ready');

  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
