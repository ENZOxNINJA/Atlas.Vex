# ATLAS VEX Portfolio

A cyberpunk-themed portfolio for Alan Marvel (alias Mr.Marvel), built with a React frontend and a FastAPI backend.

## Repository structure

- `frontend/` — React 19 application with Tailwind, Framer Motion, Three.js, Radix UI, and GitHub Pages deployment support.
- `backend/` — FastAPI API server with MongoDB (Motor), Anthropic/Claude integration, contact/chat/newsletter/intake endpoints.
- `.github/` — GitHub Actions workflow for frontend deployment.
- `design_guidelines.json` — visual system and branding guidance.
- `memory/PRD.md` — product requirements and implementation notes.

## Local development

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app runs at `http://localhost:3000`.

## Deployment

### GitHub Pages

The frontend is configured to deploy to GitHub Pages using `gh-pages`:

```bash
cd frontend
npm install
npm run deploy
```

A custom domain is already configured for `https://themarvel.space` via `frontend/public/CNAME` and `frontend/package.json`.

### Backend hosting

The backend must be hosted on a server or platform that supports FastAPI, such as a VPS, Railway, Render, or another cloud provider.
Update `frontend/.env` with the production API URL before building.

## Notes

- `frontend/.env` currently points to `https://api.themarvel.space` as the production backend endpoint.
- The FastAPI app now uses lifespan handlers instead of deprecated shutdown events.
