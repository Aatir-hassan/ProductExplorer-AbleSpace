


# frontend/Dockerfile

# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # 👉 this generates .next

# --- Runtime stage ---
FROM node:18-alpine AS runner
WORKDIR /app

# install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# copy compiled app from build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]