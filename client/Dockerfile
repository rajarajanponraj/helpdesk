

# Stage 1: Build the application
FROM node:22.13.1 AS base

RUN apt-get update && apt-get install -y git
# Set the working directory
WORKDIR /app

FROM base AS client-dev
# Copy package.json and package-lock.json for dependency installation
RUN rm -rf node_modules package-lock.json .next
COPY --link package.json  ./
COPY --link . .
# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm install

# Copy the application source code

# Build the application
# RUN npm run build



# Set environment variables
ENV NODE_ENV=development

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm","run", "dev"]