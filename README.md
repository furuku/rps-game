![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

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
```

---

<details>
<summary><h2> 1. Install Docker & Docker Compose (Click to expand)</h2></summary>
  
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

</details>

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

* **Port 80:** Must be available on the host to access the game via Nginx.
* **Internal Ports:** Services like PostgreSQL (5432) and RabbitMQ (5672) are only accessible within the Docker network for security.
* **Environment Variables:** Always ensure `.env` is configured before starting the containers.
* **Manual Testing:** Test suites are not triggered during the build process; please run them manually using the commands in section 7.

---
