# ==========================================
# Stage 1: Build React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Build static assets
COPY client/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Node.js Server
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server application
COPY server/ ./

# Copy static frontend build from stage 1
COPY --from=frontend-builder /app/client/dist /app/client/dist

# Expose HTTP port
EXPOSE 5000

# Volume to persist bookings database
VOLUME [ "/app/server/data" ]

# Start production server
CMD ["node", "server.js"]
