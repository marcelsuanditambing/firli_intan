# Architecture

## Overview

The birth-announcement site is a containerised full-stack application. A single Nginx reverse
proxy is the public entry point and routes traffic to the frontend and the
backend API. The backend talks to MariaDB.

```
                         ┌─────────────────────────────┐
   Browser  ───►  :80    │           nginx             │  (reverse proxy)
                         │   /        ─► frontend:80    │
                         │   /api/    ─► backend:3000   │
                         └──────┬───────────────┬───────┘
                                │               │
                       ┌────────▼──────┐ ┌──────▼────────┐
                       │   frontend    │ │    backend    │
                       │  Vue + Nginx  │ │ Express (MVC) │
                       └───────────────┘ └──────┬────────┘
                                                 │
                                          ┌──────▼────────┐
                                          │   mariadb     │
                                          └──────┬────────┘
                                                 │
                                          ┌──────▼────────┐
                                          │  phpmyadmin   │  :8080
                                          └───────────────┘
```

## Components

| Service     | Tech                         | Internal port | Public port |
|-------------|------------------------------|---------------|-------------|
| nginx       | Nginx (reverse proxy)        | 80            | 80          |
| frontend    | Vue 3 + Vite, served by Nginx| 80            | —           |
| backend     | Node.js + Express (MVC)      | 3000          | —           |
| mariadb     | MariaDB 11                   | 3306          | —           |
| phpmyadmin  | phpMyAdmin                   | 80            | 8080        |

Only `nginx` (80) and `phpmyadmin` (8080) are exposed to the host. Everything
else communicates over the private `app_network` bridge (prefixed with `APP_NAME`).

## Backend (MVC)

```
backend/src/
├── config/        # configuration + database pool
├── controllers/   # request handlers (the "C")
├── models/        # data access layer (the "M")
├── routes/        # URL -> controller mapping
├── middlewares/   # cross-cutting concerns (errors, 404, ...)
├── utils/         # helpers (logger, ApiError)
├── app.js         # Express app wiring
└── server.js      # process entry point
```

Views ("V") in this REST API are JSON responses produced by controllers;
the visual layer lives entirely in the Vue frontend.

## Content pipeline (template)

```
site.config.js ──► scripts/generate.mjs ──┬─► database/init/03-content.sql ──► MariaDB (content tables)
   (one file                               ├─► frontend/src/config/site.generated.js  (texts, sections, SEO)
    per client)                            ├─► frontend/src/config/theme.generated.css (accent colours)
                                           └─► frontend/public/favicon.svg
```

- Structured content (baby, parents, doctors, timeline, gallery, music, gifts)
  lives in MariaDB and is served by the API, exactly like the original Filo site.
- Presentation content (UI texts, section toggles, theme, location, name meaning)
  is compiled into the frontend bundle at build time.
- `vite.config.js` injects title/description/Open Graph tags into `index.html`
  from the same config, so link previews work without JavaScript.
