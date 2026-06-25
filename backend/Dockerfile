# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app/backend

# Copy package files from the backend folder
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the backend source code
COPY backend/ .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /usr/src/app/backend

# Copy production dependencies from the builder stage
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/backend/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]