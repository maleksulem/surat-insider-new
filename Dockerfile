# ==========================================
# STAGE 1: Build Phase
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy full source tree
COPY . .

# Compile and bundle both frontend and backend
RUN npm run build

# Remove development dependencies to keep production footprint lightweight
RUN npm prune --production

# ==========================================
# STAGE 2: Secure Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create public media storage directories to prevent runtime read-only failures
RUN mkdir -p /app/public/media && chown -R node:node /app

# Copy essential files and bundles from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/cms_database.json ./cms_database.json

# Expose production port 3000
EXPOSE 3000

# Run container process as a secure non-privileged user
USER node

# Start production server
CMD ["npm", "start"]
