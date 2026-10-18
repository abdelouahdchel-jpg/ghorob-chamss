# Multi-stage Dockerfile for Ghorob Chams Residence
# Production Node.js & Vite build

FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend production bundle
RUN npm run build

# -------------------------------------------------------------
# Production Runner
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package specifications
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled frontend and application files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/server ./server
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Create persistent data directories
RUN mkdir -p /app/data/uploads

# Expose server port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
