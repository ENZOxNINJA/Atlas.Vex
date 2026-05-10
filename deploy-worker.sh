#!/bin/bash
# ATLAS VEX Cloudflare Worker Deployment Script

echo "🚀 Deploying ATLAS VEX AI Worker to Cloudflare"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Navigate to worker directory
cd cloudflare-worker

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
wrangler auth login

# Deploy the worker
echo "📦 Deploying worker..."
wrangler deploy

# Get the worker URL
WORKER_URL=$(wrangler deploy | grep -o 'https://[^ ]*\.workers\.dev')

if [ -n "$WORKER_URL" ]; then
    echo "✅ Worker deployed successfully!"
    echo "🌐 Worker URL: $WORKER_URL"
    echo ""
    echo "📝 Update your backend .env file with:"
    echo "CLOUDFLARE_AI_URL=$WORKER_URL"
    echo ""
    echo "🧪 Test the deployment:"
    echo "curl -X POST $WORKER_URL/chat \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"session_id\": \"test\", \"message\": \"Hello Atlas Vex\"}'"
else
    echo "❌ Deployment may have failed. Check the output above."
fi

echo ""
echo "📚 For more information, see cloudflare-worker/README.md"