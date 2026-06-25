# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files from the 'frontend' directory in the build context
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the 'frontend' source code
COPY frontend/ ./

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/public ./public

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

EXPOSE 3001

CMD ["npm", "start"]