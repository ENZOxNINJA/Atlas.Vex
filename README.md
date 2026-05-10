# ATLAS VEX

**Autonomous Intelligence Systems** — Personal portfolio of Alan Marvel (alias *Mr.Marvel*), Autonomous Systems Architect.

## Overview

A cyberpunk-themed portfolio website featuring:
- **Frontend**: React 19 with Tailwind CSS, Framer Motion, and Three.js for 3D neural network visualization
- **Backend**: FastAPI with MongoDB, featuring an AI chatbot powered by Cloudflare Workers AI
- **AI Assistant**: Atlas Vex — autonomous co-pilot using Meta Llama 3.1 8B Instruct model
- **Admin Panel**: Secure inbox management for contacts, newsletter, and project intakes

## Architecture

- **Single-page portfolio** with project case studies
- **Real-time AI chat** with persistent conversation history
- **Admin dashboard** for managing communications
- **GitHub integration** for live repository feeds
- **Email notifications** via Resend
- **Docker containerization** for easy deployment

## AI System

**Atlas Vex AI** - Autonomous co-pilot powered by Cloudflare Workers AI using Meta Llama 3.1 8B Instruct model.

### Features
- **Context-Aware Conversations**: Maintains conversation history across sessions
- **Cyberpunk Personality**: Branded AI assistant with technical expertise
- **Real-time Responses**: Low-latency AI processing via Cloudflare edge network
- **Portfolio Integration**: Knowledge of Alan Marvel's projects and expertise

### Architecture
```
User → Frontend → Backend → Cloudflare Worker → Workers AI → Response
```

### Custom AI Model

The system is designed for future custom model integration. See `cloudflare-worker/training.md` for custom model training strategies and deployment options.

### Deployment

#### Cloudflare Worker
```bash
cd cloudflare-worker
npm install
npm run deploy
```

#### Backend Integration
Update `backend/.env` with your Cloudflare Worker URL:
```env
CLOUDFLARE_AI_URL=https://atlas-vex-ai.your-domain.workers.dev
CLOUDFLARE_AI_TOKEN=your-api-token
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.12+ (for local backend development)

### Using Docker (Recommended)

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Edit `.env` files with your API keys
4. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:3000/admin

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

#### Frontend
```bash
cd frontend
npm insnpm install --legacy-peer-deps

npm start
```

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=atlasvex
EMERGENT_LLM_KEY=your-llm-api-key
ADMIN_TOKEN=your-admin-token
CORS_ORIGINS=*
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Features

- **3D Neural Network Hero**: Interactive particle system using Three.js
- **AI Chatbot**: Context-aware conversations with Atlas Vex
- **Project Showcase**: Detailed case studies for LEGION CORE, ATLAS MEMORY, OMEGA SECURITY
- **Contact System**: Form submissions with email notifications
- **Newsletter Signup**: Email collection with deduplication
- **Admin Inbox**: Secure dashboard for managing all communications
- **GitHub Integration**: Live repository statistics from multiple accounts
- **Responsive Design**: Mobile-first with cyberpunk aesthetic

## API Endpoints

- `GET /api/` — Health check
- `POST /api/contact` — Contact form
- `POST /api/newsletter` — Newsletter signup
- `GET /api/telemetry` — Live metrics
- `POST /api/chat` — AI chat with Atlas Vex
- `GET /api/github/repos` — GitHub repositories
- `POST /api/intake` — Project intake form
- `GET /api/admin/*` — Admin endpoints (requires token)

## Testing

Run backend tests:
```bash
cd backend
pytest tests/
```

## Deployment

For detailed deployment instructions including DNS configuration, Docker setup, and production considerations, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Docker Deployment

```bash
# Start all services
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:3000/admin
```

For production deployment, ensure you:
1. Set secure environment variables
2. Configure MongoDB authentication
3. Set up proper CORS origins
4. Enable HTTPS

## License

This project is proprietary. See individual file headers for licensing information.
