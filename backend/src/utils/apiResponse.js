// Centralised success-response formatter -> consistent JSON shape everywhere.
// Semua key di-output sebagai snake_case agar cocok dengan frontend
// (mis. birthPlace -> birth_place, imageUrl -> image_url, fullName -> full_name).

function toSnakeKey(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function deepSnake(value) {
  if (Array.isArray(value)) return value.map(deepSnake);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[toSnakeKey(k)] = deepSnake(v);
    return out;
  }
  return value;
}

export function sendSuccess(res, { statusCode = 200, message = 'OK', data = undefined, meta = undefined } = {}) {
  const body = { success: true, message };
  // Model Sequelize -> plain object dulu (lewat toJSON), lalu key -> snake_case.
  if (data !== undefined) body.data = deepSnake(JSON.parse(JSON.stringify(data)));
  if (meta !== undefined) body.meta = deepSnake(JSON.parse(JSON.stringify(meta)));
  return res.status(statusCode).json(body);
}
