# Running the Project with Docker

This section provides instructions to set up and run the project using Docker.

## Requirements

- Docker version 20.10 or higher
- Docker Compose version 1.29 or higher

## Environment Variables

Ensure the following environment variables are set:

- `NODE_ENV`: Set to `production` for production builds.
- Database service:
  - `POSTGRES_USER`: Database username.
  - `POSTGRES_PASSWORD`: Database password.
  - `POSTGRES_DB`: Database name.

You can use the provided `.env.example` file as a template to create your `.env` file.

## Build and Run Instructions

1. Build and start the services:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:3000`.

## Service Ports

- Application: `3000` (exposed as `3000` on the host machine)
- Database: Not exposed to the host machine

## Notes

- The application is built using Node.js version `22.13.1`.
- The database service uses the `postgres:latest` image.
- Persistent data storage for the database is configured using a Docker volume (`db_data`).

For further details, refer to the Dockerfiles and Compose file included in the project.