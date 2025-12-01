#!/bin/bash
# ================================
# Deploy to PRODUCTION environment
# URL: https://mypropartner.fr
# Branch: main
# ================================

set -e

echo "=========================================="
echo "  Deploying to PRODUCTION..."
echo "=========================================="

cd ~/apps/my-pro-partner

# Pull latest changes from main branch
echo "[1/5] Pulling latest changes..."
git fetch origin
git checkout main
git pull origin main

# Build the production container
echo "[2/5] Building Docker image..."
docker-compose build --no-cache

# Stop old container and start new one
echo "[3/5] Starting containers..."
docker-compose up -d

# Run database migrations
echo "[4/5] Running database migrations..."
docker-compose exec -T app-prod npx prisma migrate deploy

# Health check
echo "[5/5] Checking health..."
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health | grep -q "200"; then
    echo ""
    echo "=========================================="
    echo "  Production deployed successfully!"
    echo "  URL: https://mypropartner.fr"
    echo "=========================================="
else
    echo ""
    echo "WARNING: Health check failed. Check logs with:"
    echo "  docker-compose logs app-prod"
fi
