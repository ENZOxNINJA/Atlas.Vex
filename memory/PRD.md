# ATLAS VEX // Portfolio — PRD

## Original Problem Statement
Personal portfolio for **Alan Marvel** (alias *Mr.Marvel*) — Autonomous Systems Architect — branded **ATLAS VEX // Autonomous Intelligence Systems**. Cyberpunk / AI-ops aesthetic.

## Architecture
- **Frontend**: React 19 (CRA) + Tailwind + Framer Motion + vanilla three.js + react-router-dom
- **Backend**: FastAPI 0.110 + Motor (MongoDB) + emergentintegrations (LlmChat) + httpx
- **AI**: Atlas Vex chat assistant via Claude Sonnet 4.5 (anthropic) using Emergent LLM key
- **External**: GitHub public API (5-min cache), Calendly link, WhatsApp QR

## Core Endpoints
- `GET /api/` — health
- `POST /api/contact` · `GET /api/contact` — contact form
- `POST /api/newsletter` — idempotent on email
- `GET /api/telemetry` — live KPI feed
- `POST /api/chat` · `GET /api/chat/history/{session_id}` — Atlas Vex AI chat
- `GET /api/github/repos` — auto-pulled public repos (cached 5 min)

## Sections (single page)
1. Hero (3D neural net + NOW strip + 3 CTAs incl Book 30-min Call)
2. About (portrait + 3 pillars)
3. Capabilities matrix (12 skills, Software Engineering primary)
4. Tech Stack (4 categories)
5. Experience timeline (4 roles, CURRENT badge)
6. Featured Systems (3 projects → /projects/:id case studies)
7. Open Source Pulse (live GitHub feed)
8. Credentials (4 certs + education + recognitions)
9. Engagement Modes (3 services)
10. Voices (3 testimonials)
11. Mission
12. Live Telemetry
13. Contact form (email/WhatsApp/Phone/GitHub + Calendly)
14. Newsletter signup
15. Footer (Operator/SLA/Availability/Location)

## Sub-routes
- `/projects/legion-core` · `/projects/atlas-memory` · `/projects/omega-security` — case studies with Architecture / Engineering Decisions / Outcomes

## Floating
- **Atlas Vex AI chatbot** (bottom-left) — Claude Sonnet 4.5, on-brand system prompt, persistent session via localStorage

## What's Implemented (2026-05-10)
- [x] All 15 sections + 3 case-study sub-pages
- [x] AI chat (Atlas Vex) with Claude Sonnet 4.5 via Emergent LLM key
- [x] GitHub auto-pull (12 repos across 3 owners, 5-min TTL cache)
- [x] Calendly booking CTA in hero (placeholder URL)
- [x] Custom SVG favicon (ATLAS.VEX brand)
- [x] SEO meta + OG card with portrait
- [x] React Router for case studies
- [x] All 3 testing iterations passing (32 backend tests total)

## Personal Data
- Name: Alan Marvel · Alias: Mr.Marvel · @mrmarvel123
- Email: Alanmarvel5@gmail.com
- WhatsApp: https://wa.me/qr/CLBPIW5WFCY3B1
- Phone: +60 11-1854 4005
- GitHub repos: github.com/{ENZOxNINJA, AtlasTheDev123, mrmarvel123}
- Calendly: calendly.com/alanmarvel5/30min (placeholder — verify/update)

## Backlog
### P1
- Replace placeholder Calendly URL with real one
- Replace placeholder Resume PDF link with real file
- Replace anonymised testimonials with real quotes
- Verify Education/Certs (currently best-guess placeholders)

### P2
- Email notifications on new contact (Resend/SendGrid)
- Admin-gated inbox view
- Real metrics from a deployed agent fleet
- Custom domain (atlasvex.io / mrmarvel.dev)
- Migrate FastAPI shutdown hook to lifespan handlers

## Next Tasks
1. Confirm Calendly URL or share a different scheduler
2. Provide real Resume PDF
3. Replace test/placeholder copy in Experience and Credentials with verified facts
