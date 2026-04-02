const express = require('express');
const nodemailer = require('nodemailer');
const pool = require('../db');
const router = express.Router();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, type, guests, dateLocation, message } = req.body;

  if (!firstName || !lastName || !email || !type) {
    return res.status(400).json({ error: 'Missing required fields: name, email, and inquiry type.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const subject = `New Jabroni's Inquiry — ${type} — ${firstName} ${lastName}`;

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1A1714; color: #F5EFE4; padding: 32px; border: 1px solid #C94B1A;">
      <h1 style="font-family: Georgia, serif; color: #C94B1A; font-size: 24px; margin-bottom: 8px; letter-spacing: 2px;">
        NEW INQUIRY
      </h1>
      <p style="color: #C9952A; font-size: 12px; letter-spacing: 3px; margin-bottom: 32px; text-transform: uppercase;">
        Jabroni's Wood Fired — Incoming
      </p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; width: 140px;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #F5EFE4;">${firstName} ${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #F5EFE4;"><a href="mailto:${email}" style="color: #E8622A;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #F5EFE4;">${phone || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Inquiry Type</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #E8622A; font-weight: bold;">${type}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Guest Count</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #F5EFE4;">${guests || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Date & Location</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3D3530; color: #F5EFE4;">${dateLocation || '—'}</td>
        </tr>
      </table>

      ${message ? `
      <div style="margin-top: 24px;">
        <p style="color: #C9952A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Message</p>
        <p style="color: #F5EFE4; line-height: 1.7; white-space: pre-wrap;">${message}</p>
      </div>
      ` : ''}

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #C94B1A; color: #3D3530; font-size: 11px; letter-spacing: 1px;">
        Jabroni's Wood Fired · Coachella Valley + South Bay LA · Old World Fire. New World Smoke.
      </div>
    </div>
  `;

  const textBody = `
NEW INQUIRY — JABRONI'S WOOD FIRED

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || '—'}
Inquiry Type: ${type}
Guest Count: ${guests || '—'}
Date & Location: ${dateLocation || '—'}

Message:
${message || '—'}
  `.trim();

  // Log to DB first — don't let an email failure lose the lead
  try {
    await pool.query(
      `INSERT INTO inquiries (first_name, last_name, email, phone, type, guests, date_location, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [firstName, lastName, email, phone || null, type, guests || null, dateLocation || null, message || null]
    );
  } catch (dbErr) {
    console.error('DB insert error:', dbErr.message);
    // Don't block the response — still attempt email
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Jabroni's Wood Fired" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send inquiry. Please try again or contact us directly.' });
  }
});

module.exports = router;
