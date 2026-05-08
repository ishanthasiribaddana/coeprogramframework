# Frontend Dockerfile for COE Program Framework
# Multi-stage build for production-optimized image

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Copy nginx configuration to builder stage
COPY nginx.docker.conf /app/nginx.docker.conf

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration from builder stage
COPY --from=builder /app/nginx.docker.conf /etc/nginx/conf.d/default.conf

# Expose port 4030 (matching production)
EXPOSE 4030

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
