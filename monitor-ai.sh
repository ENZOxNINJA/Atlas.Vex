#!/bin/bash
# ATLAS VEX AI Performance Monitor

AI_URL="https://atlas-vex-ai.your-worker-domain.workers.dev"
LOG_FILE="/var/log/atlas-vex/ai-performance.log"

echo "$(date): Starting AI performance monitoring" >> "$LOG_FILE"

# Test response time
START_TIME=$(date +%s%N)
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$AI_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "perf-test", "message": "Test performance"}')
END_TIME=$(date +%s%N)

# Calculate response time in milliseconds
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

# Extract HTTP status
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 3)

# Log results
echo "$(date): Response Time: ${RESPONSE_TIME}ms, Status: $HTTP_STATUS" >> "$LOG_FILE"

# Alert if response time is too slow (>5000ms)
if [ "$RESPONSE_TIME" -gt 5000 ]; then
    echo "$(date): ALERT - Slow response: ${RESPONSE_TIME}ms" >> "$LOG_FILE"
    # Send alert (uncomment and configure)
    # curl -X POST https://api.example.com/alert \
    #   -d "message=AI response slow: ${RESPONSE_TIME}ms"
fi

# Alert if service is down
if [ "$HTTP_STATUS" != "200" ]; then
    echo "$(date): ALERT - Service down, status: $HTTP_STATUS" >> "$LOG_FILE"
fi

# Clean up old logs (keep last 1000 lines)
tail -n 1000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"