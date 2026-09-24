# Build Stage for React Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production Stage for Node Express Backend
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install --omit=dev --ignore-scripts --legacy-peer-deps
COPY . .
# Copy compiled frontend assets to backend served path
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8089
ENV PORT=8089

CMD ["node", "server.js"]
