# Backend Dockerfile for COE Program Framework API
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port 4031 (matching production)
EXPOSE 4031

# Start the application
CMD ["node", "index.js"]
