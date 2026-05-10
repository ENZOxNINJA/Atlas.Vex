#!/bin/bash
# ATLAS VEX Health Check Script
# Run this script periodically to monitor service health

BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
MONGO_HOST="localhost"
MONGO_PORT="27017"

echo "=== ATLAS VEX Health Check ==="
echo "Timestamp: $(date)"

# Check MongoDB
echo -n "MongoDB: "
if nc -z $MONGO_HOST $MONGO_PORT 2>/dev/null; then
    echo "✅ Connected"
else
    echo "❌ Not responding"
fi

# Check Backend API
echo -n "Backend API: "
if curl -s --max-time 5 $BACKEND_URL/api/ > /dev/null; then
    echo "✅ Responding"
else
    echo "❌ Not responding"
fi

# Check Frontend
echo -n "Frontend: "
if curl -s --max-time 5 $FRONTEND_URL > /dev/null; then
    echo "✅ Responding"
else
    echo "❌ Not responding"
fi

# Check Backend Health Endpoint
echo -n "Backend Health: "
HEALTH_RESPONSE=$(curl -s $BACKEND_URL/api/)
if echo "$HEALTH_RESPONSE" | grep -q "ATLAS VEX"; then
    echo "✅ OK"
else
    echo "❌ Failed"
fi

# Check Disk Space
echo -n "Disk Space: "
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 90 ]; then
    echo "✅ ${DISK_USAGE}% used"
else
    echo "⚠️  ${DISK_USAGE}% used (High)"
fi

# Check Memory
echo -n "Memory Usage: "
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEM_USAGE -lt 90 ]; then
    echo "✅ ${MEM_USAGE}% used"
else
    echo "⚠️  ${MEM_USAGE}% used (High)"
fi

echo "=== End Health Check ==="