# ATLAS VEX // Portfolio — PRD

## Original Problem Statement
User uploaded `Portfolio Creation Details.PDF` describing a personal portfolio for **Alan Jake Marvel** (alias **Jake The Vex**) — Autonomous Systems Architect — branded **ATLAS VEX // Autonomous Intelligence Systems**. Aesthetic: cyberpunk / AI-ops command center. User selected: React+FastAPI+MongoDB stack, working contact form, "match design + add 1–2 advanced upgrades" (3D neural network hero + live telemetry dashboard), placeholder Resume/CV button, real photo provided as portrait.

## Architecture
- **Frontend**: React 19 (CRA) + Tailwind + Framer Motion + vanilla three.js (no R3F JSX — bypasses visual-edits source attribute injection)
- **Backend**: FastAPI 0.110 + Motor (MongoDB)
- **Storage**: MongoDB collection `contact_messages`
- **Endpoints**: `/api/`, `/api/contact` (POST/GET), `/api/telemetry` (GET, polled every 4s)

## Personas
- **Recruiter / Engineering Lead** — visits to evaluate technical depth and credibility before initiating contact
- **Researcher / Collaborator** — looks for project rigor, infra signals, and a comms channel
- **Client (autonomous-systems / DevSecOps engagements)** — wants a fast, trust-signal-rich landing → contact

## Core Requirements (static)
- Single-page portfolio, dark cyberpunk aesthetic (#020617 + #00E5FF cyan + #39FF14 acid green)
- Sections: Hero, Identity, Skills, Projects, Mission, Metrics, Contact, Footer
- 3D neural network background in hero
- Live telemetry dashboard
- Working contact form persisted in MongoDB
- Sticky nav with smooth-scroll section anchors
- Mobile responsive

## What's Implemented (2026-05-10)
- [x] FastAPI backend with `/api/contact` (POST/GET) + `/api/telemetry`
- [x] MongoDB persistence for contact submissions, no `_id` leak
- [x] Hero with vanilla three.js animated 3D neural network (110 nodes, animated rotation, additive blending)
- [x] Sticky glass nav (00..06 numbered links) + mobile hamburger menu
- [x] Identity section with user portrait, 3 specialization pillars, animated corner-bracket frame
- [x] Skills bento grid (11 capabilities)
- [x] 3 Project cards (LEGION CORE / ATLAS MEMORY / OMEGA SECURITY) with images, stack pills, hover glows
- [x] Mission section (large blockquote + 4 tenets)
- [x] Live Telemetry control-room grid (4 metrics, polls /api/telemetry every 4s, animated counters)
- [x] Contact form (Operator Name / Comms Address / Subject / Payload) with success/error state, social links (Email, GitHub, LinkedIn, X/Twitter)
- [x] Resume/Dossier placeholder button
- [x] Footer with operational status badge
- [x] Full data-testid coverage
- [x] All E2E tests passing (backend 8/8, frontend critical flows 100%)

## Backlog
### P1
- Real Resume/CV PDF upload + download
- Replace project images with actual screenshots / architecture diagrams
- Add real social URLs (current ones are placeholders: jake@atlasvex.io, github.com/jakethevex, etc.)
- Add deep case-study pages per project (engineering decisions, measurable outcomes)

### P2
- Email notification on new contact (Resend / SendGrid)
- Admin view (auth-gated) for incoming messages
- Live system status feed (real metrics from a deployed agent fleet)
- Three.js scroll-driven hero variations
- SEO meta + Open Graph card

## Next Tasks
1. User to provide real social URLs + email
2. User to upload Resume PDF
3. User to provide real project screenshots (or keep stock)
