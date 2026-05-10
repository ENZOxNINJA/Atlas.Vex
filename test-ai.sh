#!/bin/bash
# ATLAS VEX AI System Test Script

AI_URL="https://atlas-vex-ai.your-worker-domain.workers.dev"
BACKEND_URL="http://localhost:8000"

echo "🧪 Testing ATLAS VEX AI System"
echo "================================="

# Test 1: Worker Health Check
echo -n "1. Cloudflare Worker Health: "
if curl -s "$AI_URL/health" > /dev/null; then
    echo "✅ Online"
else
    echo "❌ Offline"
fi

# Test 2: AI Chat Response
echo -n "2. AI Chat Response: "
CHAT_RESPONSE=$(curl -s -X POST "$AI_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-session", "message": "Hello"}')

if echo "$CHAT_RESPONSE" | grep -q "reply"; then
    echo "✅ Responding"
else
    echo "❌ No response"
fi

# Test 3: Backend Integration
echo -n "3. Backend API Health: "
if curl -s "$BACKEND_URL/api/" > /dev/null; then
    echo "✅ Online"
else
    echo "❌ Offline"
fi

# Test 4: Full Integration Test
echo -n "4. Full Chat Integration: "
FULL_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "integration-test", "message": "Who are you?"}')

if echo "$FULL_RESPONSE" | grep -q "Atlas Vex"; then
    echo "✅ Integrated"
else
    echo "❌ Integration failed"
fi

# Test 5: Personality Check
echo -n "5. AI Personality: "
if echo "$CHAT_RESPONSE" | grep -q "operator\|transmission\|ATLAS"; then
    echo "✅ Cyberpunk persona active"
else
    echo "❌ Personality not detected"
fi

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo "Update AI_URL and BACKEND_URL in this script with your actual endpoints"
echo "Run this script after deployment to verify AI system functionality"