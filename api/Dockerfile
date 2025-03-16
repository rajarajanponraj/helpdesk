# Use Node.js official image
FROM node:22.13.1 AS base

# Set working directory
WORKDIR /app


FROM base AS api-dev

# Copy package files first to leverage Docker caching
COPY package.json  ./

COPY . .

# Install dependencies (including dev dependencies)
RUN --mount=type=cache,target=/root/.npm npm install --build-from-source
RUN --mount=type=cache,target=/root/.npm npm rebuild bcrypt --build-from-source
# Copy the entire project



# Set environment variables
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"


# Expose application port
EXPOSE 5003

# Start the application in development mode with live reload
CMD ["npm", "run", "dev"]
