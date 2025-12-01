#!/bin/bash
# ================================
# Deploy to STAGING environment
# URL: https://staging.mypropartner.fr
# Branch: preprod
# ================================

set -e

echo "=========================================="
echo "  Deploying to STAGING..."
echo "=========================================="

cd ~/apps/my-pro-partner

# Pull latest changes from preprod branch
echo "[1/5] Pulling latest changes..."
git fetch origin
git checkout preprod
git pull origin preprod

# Build the staging container
echo "[2/5] Building Docker image..."
docker-compose -f docker-compose.staging.yml build --no-cache

# Stop old container and start new one
echo "[3/5] Starting containers..."
docker-compose -f docker-compose.staging.yml up -d

# Run database migrations
echo "[4/5] Running database migrations..."
docker-compose -f docker-compose.staging.yml exec -T app-staging npx prisma migrate deploy

# Health check
echo "[5/5] Checking health..."
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health | grep -q "200"; then
    echo ""
    echo "=========================================="
    echo "  Staging deployed successfully!"
    echo "  URL: https://staging.mypropartner.fr"
    echo "=========================================="
else
    echo ""
    echo "WARNING: Health check failed. Check logs with:"
    echo "  docker-compose -f docker-compose.staging.yml logs app-staging"
fi
