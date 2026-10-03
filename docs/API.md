# REST API — Backend

Express + Sequelize. Base path: `/api` (through the nginx proxy in production;
`http://localhost:3000/api` in local dev).

## Response format

Every response shares one shape.

Success:
```json
{ "success": true, "message": "…", "data": { }, "meta": { } }
```
List `meta` (pagination): `{ "total": 42, "page": 1, "limit": 12, "total_pages": 4 }`.

Error:
```json
{ "success": false, "message": "Validation failed",
  "errors": [{ "field": "message", "message": "message is required" }] }
```
Status codes: 200 OK, 201 Created, 404 Not Found, 409 Conflict,
422 Validation/Unprocessable, 500 Server error.

## Common query params

- `?baby=<slug>` — choose which baby's content. The frontend always sends the slug
  from `site.config.js`; without it the backend uses `DEFAULT_BABY_SLUG`, then the first baby.
- Pagination: `?page=1&limit=12` (limit capped at 100).
- Sorting: `?sort=<column>&order=asc|desc` (whitelisted columns only).

## Endpoints

| Method | Path            | Purpose                          | Notes |
|--------|-----------------|----------------------------------|-------|
| GET    | `/api/health`   | Service + DB status              | — |
| GET    | `/api/baby`     | Baby profile incl. parents       | single object |
| GET    | `/api/gallery`  | Published photos                 | paginate; filter `is_featured`; sort `sort_order,created_at` |
| GET    | `/api/timeline` | Pregnancy timeline               | paginate; filter `week_number`; sort `sort_order,week_number,event_date` |
| GET    | `/api/music`    | Background tracks                | defaults to `is_active=true`; sort `sort_order,title` |
| GET    | `/api/gift`     | Gift / QRIS methods              | defaults to `is_active=true`; filter `type`; sort `sort_order` |
| GET    | `/api/stats`    | Visitor & wish counters          | `{ visits, unique_visitors, wishes_approved, wishes_total }` |
| GET    | `/api/wishes`   | Approved wishes                  | paginate; search `?q=`; newest first |
| POST   | `/api/wishes`   | Submit a wish                    | body below |
| POST   | `/api/visitor`  | Record a page visit              | body below |

### POST /api/wishes
```json
{ "guest_name": "Tante Rina", "guest_relation": "Keluarga", "message": "Selamat ya!" }
```
- `guest_name` required (≤100), `message` required (≤2000), `guest_relation` optional (≤60).
- `WISH_AUTO_APPROVE=true` (default) → created as `approved` and shown immediately;
  `false` → created as `pending` for moderation. Client IP stored only as a salted hash.

### POST /api/visitor
```json
{ "session_id": "uuid-optional", "page_path": "/gallery", "referrer": "https://…" }
```
- All fields optional. `user_agent` and a salted IP hash are captured server-side.

## Examples
```bash
curl "http://localhost:3000/api/baby?baby=aruna"
curl "http://localhost:3000/api/gallery?page=1&limit=8&is_featured=true"
curl "http://localhost:3000/api/wishes?page=1&limit=10&q=selamat"
curl -X POST http://localhost:3000/api/wishes \
  -H 'Content-Type: application/json' \
  -d '{"guest_name":"Budi","message":"Welcome to the world!"}'
curl -X POST http://localhost:3000/api/visitor \
  -H 'Content-Type: application/json' \
  -d '{"page_path":"/","session_id":"a1b2c3d4-0001-0000-0000-000000000001"}'
```

## Notes
- The schema (tables) is owned by `database/init/*.sql`. Sequelize maps to those
  tables and does **not** alter them in production (`DB_SYNC=false`).
- `GET /api/wishes` returns only `approved` wishes; moderation (approve/reject)
  is an admin concern to be added behind authentication later.
