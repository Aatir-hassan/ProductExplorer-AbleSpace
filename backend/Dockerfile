


# backend/Dockerfile

# --- Build stage ---
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install   # install ALL deps (including dev)

COPY . .
RUN npm run build   # compile NestJS

# --- Runtime stage ---
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev   # production deps only

COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]