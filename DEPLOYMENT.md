# 🚀 Production Deployment Guide

This guide provides step-by-step instructions for deploying the Rock-Paper-Scissors application on a fresh **Ubuntu 20.04 LTS** server using Docker.

## 📋 Prerequisites
Ensure you have root or `sudo` access to your Ubuntu server. The server must have access to the internet to download Docker images and clone the repository.

---

## 🛠️ Step 1: Server Preparation (Install Docker)
First, update your server and install Docker and Docker Compose. Run the following commands on your Ubuntu server:

# 1. Update package lists
- sudo apt update && sudo apt upgrade -y

# 2. Install Docker
- sudo apt install docker.io docker-compose git -y

# 3. Start and enable Docker to run on boot
- sudo systemctl start docker
- sudo systemctl enable docker

# 4. Install Docker Compose
- sudo apt install docker-compose-plugin -y

# 5. Verify installation
- docker --version
- docker-compose --version

## 📦 Step 2: Clone the Repository
Pull the application code onto your server.

# 1. Clone your project repository
- git clone <YOUR_GITHUB_REPOSITORY_URL> rps-game

# 2. Navigate into the project directory
- cd rps-game

## ⚙️ Step 3: Environment Configuration
The production Docker Compose file is configured to use internal networking for security, but you still need an environment file for Next.js and Prisma.

# Create .env file with production database URL
- echo 'DATABASE_URL="postgresql://user:password@postgres:5432/rps_production?schema=public"' > .env

Open the .env file (nano .env) and ensure the DATABASE_URL matches the production compose configuration:
# Production Database URL (matches docker-compose.prod.yml)
DATABASE_URL="postgresql://user:password@postgres:5432/rps_production?schema=public"

🚀 Step 4: Spin Up the Application
We will use the production compose file (docker-compose.prod.yml) which includes the Next.js application image and the PostgreSQL database.
# Build the Next.js image and start the containers in detached mode
- sudo docker-compose -f docker-compose.prod.yml up -d --build

🔍 Step 5: Verify Deployment
Check the logs to ensure everything is running smoothly and the database migration was successful.
# Check the web server logs
- sudo docker-compose -f docker-compose.prod.yml logs -f web

You should see output indicating that migrations were applied and the server is listening on port 3000 (which is mapped to port 80 on the host).

🌐 Accessing the Game
Open your web browser and navigate to your server's public IP address:
http://<YOUR_SERVER_PUBLIC_IP>
You don't need to specify a port since it is mapped to the default HTTP port (80).

🛑 Useful Commands for Maintenance
To stop the application:
- sudo docker-compose -f docker-compose.prod.yml down

To update the application with new code:
- git pull origin main
- sudo docker-compose -f docker-compose.prod.yml up -d --build



REPO_URL="<ลิงก์_GITHUB_ของคุณ>" && \
sudo apt update && sudo apt upgrade -y && \
sudo apt install docker.io docker-compose git -y && \
sudo systemctl start docker && \
sudo systemctl enable docker && \
git clone $REPO_URL rps-game && \
cd rps-game && \
echo 'DATABASE_URL="postgresql://admin:supersecretpassword@postgres:5432/rps_production?schema=public"' > .env && \
sudo docker-compose -f docker-compose.prod.yml up -d --build && \
echo "🎉 Deployment Successful! Your app is starting up."