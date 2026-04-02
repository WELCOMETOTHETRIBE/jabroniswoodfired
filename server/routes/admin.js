const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const router = express.Router();

// ─── Rate limiting ────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getRateEntry(ip) {
  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, { count: 0, lockedUntil: null });
  return rateLimitMap.get(ip);
}

function checkRateLimit(ip) {
  const entry = getRateEntry(ip);
  if (entry.lockedUntil) {
    if (Date.now() < entry.lockedUntil) return { locked: true };
    entry.count = 0;
    entry.lockedUntil = null;
  }
  return { locked: false };
}

// ─── Password verification ────────────────────────────────────────────────────
function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      try {
        resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
      } catch {
        resolve(false);
      }
    });
  });
}

// ─── Auth middleware ──────────────────────────────────────────────────────────
async function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) return res.status(401).json({ error: 'No token provided.' });

  try {
    const { rows } = await pool.query(
      `SELECT user_id FROM admin_sessions
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid or expired session.' });
    req.adminUserId = rows[0].user_id;
    next();
  } catch (err) {
    console.error('Auth check error:', err.message);
    res.status(500).json({ error: 'Auth check failed.' });
  }
}

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const { locked } = checkRateLimit(ip);

  if (locked) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash FROM admin_users WHERE username = $1',
      [username]
    );

    const user = rows[0];
    const valid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!valid) {
      const entry = getRateEntry(ip);
      entry.count += 1;
      if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCKOUT_MS;
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Clear rate limit on success
    rateLimitMap.delete(ip);

    // Create session token
    const token = crypto.randomBytes(48).toString('hex');
    await pool.query(
      `INSERT INTO admin_sessions (user_id, token) VALUES ($1, $2)`,
      [user.id, token]
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── POST /api/admin/logout ───────────────────────────────────────────────────
router.post('/logout', requireAdmin, async (req, res) => {
  const token = req.headers['authorization'].slice(7);
  await pool.query('DELETE FROM admin_sessions WHERE token = $1', [token]);
  res.json({ success: true });
});

// ─── GET /api/admin/inquiries ─────────────────────────────────────────────────
router.get('/inquiries', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, phone, type, guests, date_location, message, created_at
       FROM inquiries
       ORDER BY created_at DESC`
    );
    res.json({ inquiries: rows });
  } catch (err) {
    console.error('Inquiries fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

module.exports = router;
