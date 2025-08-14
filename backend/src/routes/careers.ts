import express from 'express';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const router = express.Router();

type ApplyBody = {
  roleTitle: string;
  roleTeam: string;
  name: string;
  email: string;
  link?: string;
  message?: string;
};

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function notifySlack(payload: { text: string }) {
  const webhook = process.env['SLACK_WEBHOOK_URL'];
  if (!webhook) return;
  try {
    await axios.post(webhook, payload, { timeout: 5000 });
  } catch {
    // ignore
  }
}

router.post('/apply', async (req, res) => {
  try {
    const { roleTitle, roleTeam, name, email, link = '', message = '' } = (req.body || {}) as ApplyBody;
    if (!roleTitle || !roleTeam || !name || !email) {
      return res.status(400).json({ success: false, error: 'roleTitle, roleTeam, name, email are required' });
    }

    const record = {
      roleTitle,
      roleTeam,
      name,
      email,
      link,
      message,
      userAgent: req.get('User-Agent') || '',
      ip: req.ip,
      at: new Date().toISOString(),
    };

    const dir = path.join(process.cwd(), 'logs', 'applications');
    ensureDirSync(dir);
    const file = path.join(dir, `${Date.now()}-${name.replace(/[^a-z0-9_-]+/gi, '_')}.json`);
    fs.writeFileSync(file, JSON.stringify(record, null, 2));

    // Slack notification (if configured)
    await notifySlack({
      text: `New career application: ${roleTitle} (${roleTeam})\nName: ${name}\nEmail: ${email}\nLink: ${link || '-'}\nMessage: ${message ? message.slice(0, 500) : '-'}`,
    });

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
});

export default router;

