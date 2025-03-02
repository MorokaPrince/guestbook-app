# Use Node.js LTS version as the base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for versioning
ENV VERSION=v1

# Command to run the application
CMD ["node", "app.js"]