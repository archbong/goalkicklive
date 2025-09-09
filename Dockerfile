# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only package files for caching
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js for production
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy build output and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose port and run
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
