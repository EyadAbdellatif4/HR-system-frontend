# Multi-stage build for optimization
FROM node:20-alpine AS builder

# Accept build arguments for API URL
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm ci if package-lock.json exists, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci && npm cache clean --force; else npm install && npm cache clean --force; fi

# Copy source code
COPY . .

# Build the application
# VITE_API_URL is embedded at build time
RUN npm run build

# Production stage - serve static files
FROM node:20-alpine AS production

# Install serve globally to serve static files
RUN npm install -g serve

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=reactjs:nodejs /app/dist ./dist

# Switch to non-root user
USER reactjs

# Expose port (Cloud Run uses PORT env var, default to 8080)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080} || exit 1

# Start the server
# Cloud Run sets PORT env var
# -s flag serves SPA (single-page app) with proper routing
# -l flag sets listen address and port
CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]

