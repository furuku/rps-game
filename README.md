# RPS Game - Installation & Run Guide

## 1. Install Docker & Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
docker --version
docker-compose --version

## 2. Clone Project
git clone <YOUR_PROJECT_GIT_URL>
cd <YOUR_PROJECT_FOLDER>

## 3. Create `.env` file
cat > .env <<EOF
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
POSTGRES_DB=rps_db
DATABASE_URL=postgresql://admin:password123@postgres:5432/rps_db
RABBITMQ_URL=amqp://rabbitmq:5672
NODE_ENV=production
EOF

## 4. Start Services
docker-compose up -d
docker ps
docker logs -f rps_web

## 5. Verify Healthcheck
curl http://localhost:3000/api/health
# Expected output: { "status": "ok" }

## 6. Access the Application
- Browser:
  - Google Chrome (Windows 10 / 11)
  - Safari (iOS 15)
- URL: http://<SERVER_IP>/

## 7. Running Tests (Optional)
To run unit tests or E2E tests:

# Unit tests
docker-compose run --rm test

# E2E tests
docker-compose run --rm e2e

## Notes
- The production image **does not run tests at build time**. Tests are run separately via `docker-compose run` if needed.
- All services are configured to wait for dependencies (Postgres, RabbitMQ) before starting.
- `.env` file must match your environment.
- Make sure ports 80, 3000, 5432, 5672, 15672 are open if accessing remotely.