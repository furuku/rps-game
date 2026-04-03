# RPS Game - Deployment Guide

## Overview
This document describes the deployment architecture, configuration, and operational design of the RPS Game system.
The system is designed to be **containerized, scalable, and production-ready** using Docker and Docker Compose.

## Architecture Overview
The system consists of the following components:
- Nginx: Reverse proxy and load balancer
- Web (Next.js): Application servers (multiple instances)
- PostgreSQL: Relational database
- RabbitMQ: Message queue for asynchronous processing

All services are deployed using Docker Compose within a shared internal network.

## Service Communication
Nginx -> Web
    - Routes incoming HTTP requests to multiple web instances
    - Performs load balancing (round-robin)
Web -> PostgreSQL
    - Uses `DATABASE_URL` via internal Docker DNS (`postgres`)
Web -> RabbitMQ
    - Uses `RABBITMQ_URL` via internal Docker DNS (`rps_rabbitmq`)

All services communicate over Docker's internal network (no external exposure required)

## Environment Configuration
Environment variables are defined in a `.env` file:
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `DATABASE_URL` - PostgreSQL connection string
- `RABBITMQ_URL` - RabbitMQ connection string
- `NODE_ENV` - Application environment

Sensitive data is **not hardcoded** and should not be committed to version control.

## Deployment Strategy
- Uses **multi-stage Docker build** for optimized image size
- Dependencies are installed in a separate stage
- Application is built in a builder stage
- Final image contains only production dependencies

Deployment flow:
1. Build Docker images
2. Start services via Docker Compose
3. Wait for dependencies (PostgreSQL, RabbitMQ)
4. Run Prisma migrations
5. Start application

## Load Balancing & Scaling

- Multiple web instances (`web1`, `web2`) are deployed
- Nginx distributes incoming traffic across instances
- Default strategy: **round-robin**

### Horizontal Scaling
To scale further:
```bash
docker compose up --scale web=3
```
(or define additional services)

## Health Checks & Reliability
* Each service includes a **health check**
* Docker Compose ensures:
  - Dependent services start only when healthy
  - Restart policies handle transient failures

### Example:
- PostgreSQL -> `pg_isready`
- RabbitMQ -> `rabbitmq-diagnostics ping`
- Web -> `/api/health`

## Failure Handling
* If one web instance fails:
    - Nginx automatically routes traffic to remaining instances

* Ensures **high availability**

* Containers are configured with:
    - `restart: always`

## Testing Strategy
**Unit Tests**
  - Run via Docker (`docker compose --profile test run test`)

**End-to-End Tests**
  - Implemented using Playwright
  - Run in isolated container environment

* Tests are **not executed during build**
  - Ensures faster production builds
  - Keeps runtime clean

## CI/CD Considerations (Future)
Potential improvements:
- Automate build & test pipeline (GitHub Actions / GitLab CI)
- Auto-deploy on merge to main branch
- Add Docker image versioning

## Security Considerations
- Environment variables used for sensitive configuration
- `.env` is excluded from version control
- Database and RabbitMQ are not exposed publicly (internal network only)

## Monitoring & Observability (Future)
Recommended enhancements:
- Add **Prometheus + Grafana** for monitoring
- Centralized logging (ELK stack)
- Health dashboards

## Production Considerations
- Add HTTPS (TLS) via Nginx or reverse proxy
- Configure firewall (allow only required ports)
- Use managed database for higher reliability
- Deploy using orchestration tools (e.g., Kubernetes)

## Summary
This deployment setup provides:
* Containerized architecture
* Scalable web layer
* Load balancing with failover
* Health-aware orchestration
* Separation of concerns
* Production-ready foundation
