require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');
const pool = require('./db');

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Usage: node seed-admin.js <username> <password>');
  process.exit(1);
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function seed() {
  const client = await pool.connect();
  try {
    const hash = await hashPassword(password);
    await client.query(
      `INSERT INTO admin_users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hash]
    );
    console.log(`✓ Admin user "${username}" created (or updated).`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
