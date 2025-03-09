# Use Node.js LTS version as the base image
FROM node:16-alpine

# Add metadata labels
LABEL maintainer="Student"
LABEL version="1.0"
LABEL description="Guestbook application for Kubernetes deployment"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production && \
    npm cache clean --force

# Create a non-root user
RUN addgroup -g 1000 appuser && \
    adduser -u 1000 -G appuser -s /bin/sh -D appuser

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for versioning
ENV VERSION=v1

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost:3000/ || exit 1

# Command to run the application
CMD ["node", "app.js"]