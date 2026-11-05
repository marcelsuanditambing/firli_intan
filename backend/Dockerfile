# =============================================================================
# Backend Dockerfile - Node.js + Express (production)
# =============================================================================
FROM node:22-alpine

# Chromium untuk membuat PDF Buku Kenangan, beserta font cadangan & emoji
# (ucapan sering berisi emoji 🤲🥰 -> tetap tampil berwarna di PDF).
RUN apk add --no-cache \
      chromium nss freetype harfbuzz ca-certificates ttf-freefont font-noto-emoji

ENV NODE_ENV=production
ENV PORT=3000
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
WORKDIR /usr/src/app

# Reproducible install of production deps only (uses package-lock.json)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# App source, owned by the unprivileged "node" user that ships with the image
COPY --chown=node:node . .

USER node
EXPOSE 3000

# Container-level health probe (compose also defines one)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
