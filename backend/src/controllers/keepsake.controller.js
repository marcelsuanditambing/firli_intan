import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { isEnabled, checkPin, issueToken, verifyToken } from '../services/keepsake/access.js';
import { getBookPdf } from '../services/keepsake/book.js';

function requireEnabled() {
  if (!isEnabled()) throw new ApiError(404, 'Keepsake book is not enabled');
}

// GET /api/keepsake/status -> { enabled } (tautan di footer hanya tampil bila aktif)
export const getStatus = (req, res) => sendSuccess(res, { message: 'Keepsake status', data: { enabled: isEnabled() } });

// POST /api/keepsake/unlock { pin } -> { token, expires_at }
export const unlock = (req, res) => {
  requireEnabled();
  const result = checkPin(req.ip, req.body.pin);

  if (result.retryAfter) {
    res.set('Retry-After', String(result.retryAfter));
    return res.status(429).json({
      success: false,
      message: 'Too many wrong PIN attempts. Try again later.',
      data: { retry_after_seconds: result.retryAfter },
    });
  }
  if (!result.ok) {
    logger.warn(`keepsake: PIN salah (sisa ${result.attemptsLeft} percobaan)`);
    return res.status(401).json({
      success: false,
      message: 'Wrong PIN',
      data: { attempts_left: result.attemptsLeft },
    });
  }
  return sendSuccess(res, { message: 'Unlocked', data: issueToken() });
};

function tokenFrom(req) {
  const header = req.get('authorization') || '';
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return typeof req.query.token === 'string' ? req.query.token : '';
}

// GET /api/keepsake/book.pdf  (Authorization: Bearer <token>, atau ?token=)
export const downloadBook = asyncHandler(async (req, res) => {
  requireEnabled();
  if (!verifyToken(tokenFrom(req))) throw new ApiError(401, 'Keepsake is locked');

  const pdf = await getBookPdf(req.query);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Length': String(pdf.length),
    'Content-Disposition': 'attachment; filename="keepsake-book.pdf"',
    'Cache-Control': 'no-store',
  });
  return res.end(pdf);
});
