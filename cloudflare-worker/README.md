# ATLAS VEX AI Worker

Cloudflare Worker implementation of the Atlas Vex AI chatbot using Cloudflare Workers AI.

## Features

- **AI-Powered Chat**: Uses Meta Llama 3.1 8B Instruct model
- **Context Awareness**: Maintains conversation history
- **Cyberpunk Personality**: Atlas Vex branded responses
- **CORS Enabled**: Configured for themarvel.space domain
- **Stateless Design**: Ready for horizontal scaling

## Setup

### Prerequisites

1. Cloudflare account with Workers AI enabled
2. Wrangler CLI installed
3. Node.js 16+

### Installation

```bash
cd cloudflare-worker
npm install
```

### Configuration

1. Update `wrangler.toml` with your Cloudflare account details
2. Set environment variables in Cloudflare dashboard or wrangler.toml

### Local Development

```bash
npm run dev
```

This will start a local development server at `http://localhost:8787`

### Deployment

```bash
npm run deploy
```

## API Endpoints

### POST /chat
Chat with Atlas Vex AI.

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "message": "Hello, who are you?"
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "reply": "Greetings, operator. Atlas Vex online...",
  "timestamp": "2026-05-10T17:30:00.000Z",
  "model": "@cf/meta/llama-3.1-8b-instruct"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "service": "ATLAS VEX AI",
  "model": "@cf/meta/llama-3.1-8b-instruct"
}
```

## Model Configuration

The Atlas Vex AI uses a Legion-derived core engine concept:
- **Core Engine**: NEXUS-LEGION X OMEGA persona and prompt architecture
- **Base Model**: `@cf/meta/llama-3.1-8b-instruct`
- Max tokens: 500
- Temperature: 0.7
- Top P: 0.9

## Environment Variables

- `ATLAS_VEX_SYSTEM_PROMPT`: The system prompt defining Atlas Vex personality

## CORS Configuration

Configured to allow requests from:
- `https://themarvel.space`
- `https://www.themarvel.space`
- `http://localhost:3000` (development)

## Future Enhancements

- [ ] Add conversation persistence with Cloudflare KV
- [ ] Implement rate limiting
- [ ] Add analytics and monitoring
- [ ] Support for multiple AI models
- [ ] Voice integration
- [ ] Multi-language support

## Architecture

```
User Request → Cloudflare Worker → Workers AI → Response
                      ↓
                Conversation Context
                      ↓
               System Prompt + History
```

## Security

- CORS protection
- Input validation
- Rate limiting (to be implemented)
- Secure environment variable handling