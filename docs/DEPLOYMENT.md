# Production Deployment — Ubuntu Server 24.04

Production stack: Docker + Docker Compose, Nginx (TLS termination + reverse
proxy), MariaDB, phpMyAdmin, with Let's Encrypt SSL, automated backups, and
security hardening.

Files used in production:
- `docker-compose.prod.yml` — the production stack
- `backend/Dockerfile`, `frontend/Dockerfile` — multi-stage, non-root, healthchecked
- `nginx/nginx.prod.conf`, `nginx/templates/default.conf.template`, `nginx/ssl-params.conf`
- `scripts/` — `setup-server.sh`, `init-letsencrypt.sh`, `backup.sh`, `restore.sh`, `deploy.sh`
- `.env.production.example` — copy to `.env`

---

## 0. DNS
Point an `A` record for `DOMAIN` **and** `www.DOMAIN` to the server's public IP
before requesting certificates.

## 1. Prepare the server (one time)
```bash
git clone <repo-situs-ini> /opt/<nama-situs>
cd /opt/<nama-situs>
sudo ./scripts/setup-server.sh      # Docker + UFW (22/80/443) + fail2ban + auto-updates
# log out/in so your user can run docker without sudo
```

## 2. Configure secrets
```bash
cp .env.production.example .env
nano .env          # set APP_NAME, DOMAIN, CERTBOT_EMAIL, CORS_ORIGIN, all passwords, IP_HASH_SALT
chmod 600 .env     # restrict the secrets file
```
Generate strong values with `openssl rand -base64 24`.

## 3. Build & start the stack
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```
Make sure `node scripts/generate.mjs` has been run (the generated files are
committed, so a fresh clone already has them). On first boot MariaDB runs
`database/init/*.sql` (schema + content from `site.config.js`). The database
has **no published port** — it is only reachable on the internal network.

## 4. Issue the TLS certificate
Tip: set `CERTBOT_STAGING=1` in `.env` for a dry run first (avoids hitting
Let's Encrypt rate limits), confirm it works, then set it back to `0` and re-run.
```bash
./scripts/init-letsencrypt.sh
```
This creates a temporary cert, starts nginx, completes the ACME http-01
challenge, installs the real certificate, generates DH params, and reloads
nginx. Your site is then live at `https://DOMAIN`. Certificates auto-renew (the
`certbot` service renews; nginx reloads every 6h to pick them up).

## 5. Verify
```bash
curl -I https://DOMAIN                 # 200 + HSTS header
curl https://DOMAIN/api/health         # {"success":true,...,"database":"connected"}
docker compose -f docker-compose.prod.yml ps   # all services "healthy"
```

---

## SSL configuration
- TLS 1.2/1.3 only, modern cipher suite, OCSP stapling, session cache, custom
  DH params (`nginx/ssl-params.conf`).
- HTTP→HTTPS redirect; HSTS (2y, preload) plus `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a CSP that
  allows Google Fonts and the Maps embed.
- Auto-renewal via the `certbot` service; force a renew test with:
  `docker compose -f docker-compose.prod.yml run --rm certbot renew --dry-run`.

## Healthchecks
Every service defines a Docker healthcheck:
- mariadb: `healthcheck.sh --connect --innodb_initialized`
- backend: HTTP `GET /api/health`
- frontend: `GET /`
- nginx: `GET /healthz` (returns 200 without redirect)
`docker compose ps` shows health; unhealthy containers are visible to monitoring.

## Logging
- All containers use the `json-file` driver with rotation (10 MB × 5 files).
- Nginx access/error logs persist in the `nginx_logs` volume and stream to
  stdout. Tail logs with:
```bash
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend
docker compose -f docker-compose.prod.yml logs -f nginx
```

## Backups & restore
```bash
./scripts/backup.sh                    # -> backups/<APP_NAME>_<db>_<timestamp>.sql.gz (verified + rotated)
./scripts/restore.sh backups/<file>.sql.gz   # DESTRUCTIVE: prompts for confirmation
```
Schedule daily backups via cron:
```bash
crontab -e
# 30 2 * * * cd /opt/<nama-situs> && ./scripts/backup.sh >> /var/log/<nama-situs>-backup.log 2>&1
```
Keep copies off-server (e.g. `rclone`/`scp` the `backups/` directory).

## Security hardening (what's already applied)
- **Network isolation**: MariaDB is never published; services talk over a
  private bridge network.
- **phpMyAdmin** is bound to `127.0.0.1:8080` only — reach it through an SSH
  tunnel, never the public internet:
  ```bash
  ssh -L 8080:127.0.0.1:8080 user@server   # then open http://localhost:8080
  ```
- **Least privilege**: `no-new-privileges` on every service; containers run as
  non-root (`node` for backend, `nginx` for web); the backend rootfs is
  read-only with a tmpfs `/tmp`.
- **Reproducible images**: `npm ci` from lockfiles; production-only deps.
- **Edge protection**: Nginx hides its version, enforces request timeouts
  (slowloris), and rate-limits `/api/` (10 r/s, burst 20) and the site
  (30 r/s, burst 50).
- **Host**: UFW limits inbound to 22/80/443; fail2ban guards SSH; unattended
  security upgrades enabled.
- **Secrets**: kept in `.env` (chmod 600), never committed.

Recommended additional steps: disable SSH password auth (keys only), set
`CERTBOT_STAGING=0` only after a successful staging run, and consider moving
SSH off port 22.

## Updating
```bash
cd /opt/<nama-situs> && ./scripts/deploy.sh    # git pull + generate + rebuild + sync content + prune
```

## Updating content only
```bash
nano site.config.js            # e.g. baby is born: set time, weight, length
./scripts/sync-content.sh      # regenerate + apply to DB + rebuild frontend
```
Wishes (`greetings`) and visitor statistics are never touched by a content sync.

## Beberapa situs di satu server

Setiap situs adalah satu folder terpisah dengan `.env` sendiri. Yang wajib
berbeda antar situs:

| Variabel | Situs A (mis. Filo) | Situs B (teman) |
|---|---|---|
| `APP_NAME` | `filo` | `aruna` |
| `NGINX_PORT` / `NGINX_HTTPS_PORT` | `80` / `443` | `8081` / `8444` |
| `PMA_PORT` | `8080` | `8082` |
| `DOMAIN` | `filo.example.com` | `aruna.example.com` |

Hanya satu proses yang bisa memegang port 80/443. Bila beberapa situs berbagi
server, jalankan **stack sederhana** (`docker-compose.yml`, tanpa certbot) untuk
situs kedua dan seterusnya dengan `NGINX_PORT` unik, lalu arahkan domainnya dari
reverse proxy di host (Nginx/Caddy/Traefik yang memegang 80/443 dan TLS), mis.:

```nginx
server {
    server_name aruna.example.com;
    location / { proxy_pass http://127.0.0.1:8081; proxy_set_header Host $host;
                 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                 proxy_set_header X-Forwarded-Proto $scheme; }
}
```

## Common operations
```bash
# Stop / start (data preserved)
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# Full reset INCLUDING the database volume (irreversible)
docker compose -f docker-compose.prod.yml down -v
```
