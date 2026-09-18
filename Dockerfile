# Build Stage for React Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production Stage for Node Express Backend
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN apk add --no-cache python3 make g++
RUN npm install --omit=dev
COPY . .
# Copy compiled frontend assets to backend served path
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8089
ENV PORT=8089

CMD ["node", "server.js"]
