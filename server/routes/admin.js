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

// ─── Password helpers ─────────────────────────────────────────────────────────
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

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
      `SELECT user_id FROM admin_sessions WHERE token = $1 AND expires_at > NOW()`,
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
  if (locked) return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash FROM admin_users WHERE username = $1', [username]
    );
    const user = rows[0];
    const valid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!valid) {
      const entry = getRateEntry(ip);
      entry.count += 1;
      if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCKOUT_MS;
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    rateLimitMap.delete(ip);
    const token = crypto.randomBytes(48).toString('hex');
    await pool.query(`INSERT INTO admin_sessions (user_id, token) VALUES ($1, $2)`, [user.id, token]);
    res.json({ token, userId: user.id });
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
       FROM inquiries ORDER BY created_at DESC`
    );
    res.json({ inquiries: rows });
  } catch (err) {
    console.error('Inquiries fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, created_at FROM admin_users ORDER BY created_at ASC`
    );
    res.json({ users: rows });
  } catch (err) {
    console.error('Users fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ─── POST /api/admin/users ────────────────────────────────────────────────────
router.post('/users', requireAdmin, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });
  if (username.length < 2) return res.status(400).json({ error: 'Username must be at least 2 characters.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  try {
    const hash = await hashPassword(password);
    const { rows } = await pool.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at`,
      [username.toLowerCase().trim(), hash]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already exists.' });
    console.error('Create user error:', err.message);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// ─── PUT /api/admin/users/:id/password ───────────────────────────────────────
router.put('/users/:id/password', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'New password is required.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  try {
    const { rowCount } = await pool.query(
      `UPDATE admin_users SET password_hash = $1 WHERE id = $2`,
      [await hashPassword(password), id]
    );
    if (!rowCount) return res.status(404).json({ error: 'User not found.' });

    // Invalidate all sessions for this user (force re-login with new password)
    await pool.query('DELETE FROM admin_sessions WHERE user_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// ─── PUT /api/admin/users/:id/username ───────────────────────────────────────
router.put('/users/:id/username', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'New username is required.' });
  if (username.length < 2) return res.status(400).json({ error: 'Username must be at least 2 characters.' });

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE admin_users SET username = $1 WHERE id = $2 RETURNING id, username, created_at`,
      [username.toLowerCase().trim(), id]
    );
    if (!rowCount) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already exists.' });
    console.error('Change username error:', err.message);
    res.status(500).json({ error: 'Failed to update username.' });
  }
});

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
router.delete('/users/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (parseInt(id) === req.adminUserId) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const { rowCount } = await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
