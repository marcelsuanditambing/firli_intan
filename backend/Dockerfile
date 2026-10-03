# =============================================================================
# Backend Dockerfile - Node.js + Express (production)
# =============================================================================
FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=3000
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
