# Use official Node.js image as base image
FROM node:23-slim

# Set working directory for the frontend
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy all the frontend files to the container
COPY frontend /app

# Build the React app using Vite
RUN npm run build

# Install a simple server to serve the production build (e.g., serve)
RUN npm install -g serve

# Expose port 5000 (default port for serving React app)
EXPOSE 5000

# Serve the app
CMD ["serve", "-s", "dist", "-l", "5000"]
