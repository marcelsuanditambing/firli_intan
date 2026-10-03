import crypto from 'node:crypto';
import config from '../config/index.js';

// One-way hash of an IP (privacy): we never store the raw address.
export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(config.app.ipHashSalt + ip).digest('hex');
}
