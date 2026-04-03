# RPS Game - Installation & Run Guide

## Overview

This project is a full-stack RPS (Rock-Paper-Scissors) game built with:

* Next.js (Frontend + Backend)
* PostgreSQL (Database)
* RabbitMQ (Message Queue)
* Docker & Docker Compose (Deployment)

## Quick Start

```bash
git clone https://github.com/furuku/rps-game.git
cd rps-game
cp .env.example .env   # or create manually
docker compose up --build -d

---

## 1. Install Docker & Docker Compose (v2)

### Option A (Recommended - Official Docker)

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker

docker --version
docker compose version
```

### Option B (Quick Install)

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker

docker --version
docker compose version
```

---

## 2. Clone Project

```bash
git clone https://github.com/furuku/rps-game.git
cd rps-game
```

---

## 3. Create `.env` file

```bash
cat > .env <<EOF
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=rps_db
DATABASE_URL=postgresql://user:password@postgres:5432/rps_db
RABBITMQ_URL=amqp://guest:guest@rps_rabbitmq:5672
NODE_ENV=production
EOF
```

---

## 4. Start Services

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

## 5. Verify Healthcheck

```bash
curl http://localhost/api/health
```

Expected output:

```json
{ "status": "ok" }
```

---

## 6. Access the Application

* URL:

  ```
  - Local: http://localhost/
  - http://<SERVER_IP>/
  ```

* Tested on:

  * Google Chrome (Windows 10/11)
  * Safari (iOS 15+)

---

## 7. Running Tests

### Unit Tests

```bash
docker compose --profile test run --rm test
```

### End-to-End Tests (Playwright)

```bash
docker compose --profile test run --rm e2e
```

---

## Architecture Highlights

* **Dockerized microservices**
  - Web (Next.js)
  - PostgreSQL
  - RabbitMQ

* **Nginx Reverse Proxy + Load Balancer**
  - Distributes traffic across multiple web instances
  - Improves scalability and availability

* **Health Checks**
  - Ensures services are ready before startup

* **Prisma ORM**
  - Handles database migrations and queries

* **Event-driven architecture**
  - RabbitMQ used for async processing

---

## Troubleshooting

### Check logs

```bash
docker compose logs -f
```

### Restart services

```bash
docker compose down
docker compose up --build -d
```

### Rebuild from scratch

```bash
docker compose down -v
docker compose up --build
```

---

## Notes

* Ensure ports **80, 3000, 5432, 5672, 15672** are open
* `.env` must match your environment
* All services wait for dependencies before starting
* Tests are **not executed during build** (run manually)

---
