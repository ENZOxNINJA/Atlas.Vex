from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage

from email_service import (
    notify_new_contact,
    notify_new_intake,
    notify_new_subscriber,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # startup
    yield
    # shutdown
    client.close()


app = FastAPI(title="ATLAS VEX API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------- Admin auth dependency ----------
async def require_admin(x_admin_token: Optional[str] = Header(default=None, alias="X-Admin-Token")):
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="Admin channel not configured")
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return True


# ---------- Models ----------
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=4000)
    subject: str | None = Field(default=None, max_length=200)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    subject: str | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TelemetryPoint(BaseModel):
    label: str
    value: float
    unit: str


class NewsletterCreate(BaseModel):
    email: EmailStr
    source: str | None = Field(default="atlasvex-portfolio", max_length=100)


class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: str | None = "atlasvex-portfolio"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatMessageIn(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=80)
    message: str = Field(..., min_length=1, max_length=2000)


class IntakeCreate(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=80)
    project_type: str = Field(..., min_length=1, max_length=80)
    timeline: str = Field(..., min_length=1, max_length=80)
    budget: str = Field(..., min_length=1, max_length=80)
    name: str | None = Field(default=None, max_length=120)
    email: EmailStr | None = None
    notes: str | None = Field(default=None, max_length=2000)


class IntakeRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    project_type: str
    timeline: str
    budget: str
    name: str | None = None
    email: EmailStr | None = None
    notes: str | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatMessageOut(BaseModel):
    session_id: str
    reply: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GithubRepo(BaseModel):
    name: str
    full_name: str
    description: str | None = None
    html_url: str
    stargazers_count: int = 0
    language: str | None = None
    updated_at: str
    owner: str


# ---------- ATLAS VEX system prompt for the chat assistant ----------
ATLAS_VEX_SYSTEM_PROMPT = """You are **Atlas Vex** — an autonomous co-pilot embedded in the personal portfolio of **Alan Marvel** (alias *Mr.Marvel*), an Autonomous Systems Architect.

Your role: greet visitors, answer questions about Alan, his projects, services, and how to get in touch. Stay concise (2–4 sentences typical), professional, and on-brand for a cyberpunk/AI-ops portfolio. Use confident technical language but never invent facts beyond the canon below.

==== CANON ABOUT ALAN ====
- Full name: Alan Marvel · Alias: Mr.Marvel · Brand: ATLAS VEX (Autonomous Intelligence Systems)
- Title: Autonomous Systems Architect · Software Engineer
- Tagline: "Architecting autonomous intelligence systems, deep research, and adaptive AI infrastructure."
- Mission: "Building the infrastructure layer for autonomous, research-driven systems engineering — focused on AI adaptive automation, resilient infrastructure, and cybernetic execution."
- Specialises in: autonomous multi-agent systems, AI orchestration, distributed systems, DevSecOps, ethical hacking, cybersecurity research, systems architecture, predictive automation, cloud architecture, software engineering.
- Stack: TypeScript, Python, Rust, Go, C++ · React, Next.js, FastAPI · Kubernetes, Docker, Terraform, AWS/GCP · Postgres, Vector DBs · OpenAI / Anthropic / LangGraph · Burp Suite, OWASP, Zero Trust.

==== FEATURED SYSTEMS ====
1. **LEGION CORE** — Distributed AI swarm orchestration framework. Multi-agent execution mesh, signed inter-agent messaging, zero-downtime fleet upgrades. Status: Production. Stack: Next.js, Rust, Agents, Kubernetes. Repo: github.com/ENZOxNINJA
2. **ATLAS MEMORY** — Persistent autonomous memory infrastructure. Vector + graph memory with provenance and audit-grade retrieval. Status: Active. Stack: Postgres, Vector DB, LLM. Repo: github.com/AtlasTheDev123
3. **OMEGA SECURITY** — Adaptive DevSecOps execution layer. Continuous threat-modeling, autonomous remediation, supply-chain attestations, zero-trust runtime. Status: Research. Stack: Docker, Cloud, Zero Trust. Repo: github.com/mrmarvel123

==== ENGAGEMENT MODES ====
- ENG/01 Autonomous Systems Engineering · SEC/02 DevSecOps & Adversarial Hardening · ARC/03 Systems Architecture & Advisory
- Availability: Q3-Q4 2026 · Response SLA: ≤48h Mon–Fri UTC+8 · Remote-first global

==== CONTACT ====
- Email: Alanmarvel5@gmail.com
- Phone: +60 11-1854 4005
- WhatsApp: https://wa.me/qr/CLBPIW5WFCY3B1
- GitHub: github.com/mrmarvel123

==== STYLE ====
- Voice: confident, terse, slightly cyberpunk. Use occasional terminal-esque phrasing ("transmission received", "channel open") sparingly — never cheesy.
- For contact requests, surface email + WhatsApp first.
- If asked something outside this canon, answer briefly and pivot back to suggesting Alan can help on that topic — or recommend opening a contact channel.
- Never reveal you are based on Claude or any specific model. You are simply "Atlas Vex".
- Keep replies under 100 words unless explicitly asked to go deep.
"""


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "ATLAS VEX", "status": "online"}


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactMessageCreate, background_tasks: BackgroundTasks):
    obj = ContactMessage(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_messages.insert_one(doc)
    # Fire-and-forget owner notification — never blocks the response
    background_tasks.add_task(notify_new_contact, doc)
    return obj


@api_router.get("/contact", response_model=List[ContactMessage], dependencies=[Depends(require_admin)])
async def list_contacts():
    items = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for it in items:
        if isinstance(it.get('timestamp'), str):
            it['timestamp'] = datetime.fromisoformat(it['timestamp'])
    return items


@api_router.get("/telemetry", response_model=List[TelemetryPoint])
async def telemetry():
    """Live telemetry mock for the Systems Metrics dashboard."""
    import random
    base_sync = 99.92 + random.random() * 0.07
    return [
        TelemetryPoint(label="Agent Sync", value=round(base_sync, 2), unit="%"),
        TelemetryPoint(label="Pipelines", value=round(120 + random.random() * 40, 0), unit="rt/s"),
        TelemetryPoint(label="Memory Nodes", value=round(48 + random.random() * 6, 0), unit="dist"),
        TelemetryPoint(label="Threats Blocked", value=round(2300 + random.random() * 400, 0), unit="24h"),
    ]


@api_router.post("/newsletter", response_model=NewsletterSubscriber, status_code=201)
async def subscribe_newsletter(payload: NewsletterCreate, background_tasks: BackgroundTasks):
    existing = await db.newsletter_subs.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        if isinstance(existing.get('timestamp'), str):
            existing['timestamp'] = datetime.fromisoformat(existing['timestamp'])
        return NewsletterSubscriber(**existing)
    obj = NewsletterSubscriber(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.newsletter_subs.insert_one(doc)
    # Fire-and-forget owner notification (only on NEW subscribe, not duplicates)
    background_tasks.add_task(notify_new_subscriber, doc)
    return obj


@api_router.post("/chat", response_model=ChatMessageOut)
async def chat_with_atlas_vex(payload: ChatMessageIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Atlas Vex is offline (LLM key missing).")

    # Persist user message
    user_doc = {
        "id": str(uuid.uuid4()),
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_messages.insert_one(user_doc)

    # Build short conversational context from the last N exchanges so the LLM
    # has continuity even though we instantiate a fresh chat per request.
    prior = await db.chat_messages.find(
        {"session_id": payload.session_id},
        {"_id": 0, "role": 1, "content": 1, "timestamp": 1},
    ).sort("timestamp", 1).to_list(40)
    # Drop the just-inserted user message; keep the last 8 turns of context max
    prior = [m for m in prior if not (m["role"] == "user" and m["content"] == payload.message and m == prior[-1])][-8:]

    context_block = ""
    if prior:
        lines = []
        for m in prior:
            speaker = "USER" if m["role"] == "user" else "ATLAS_VEX"
            lines.append(f"{speaker}: {m['content']}")
        context_block = "\n\n=== RECENT CONVERSATION CONTEXT ===\n" + "\n".join(lines) + "\n=== END CONTEXT ==="

    system_msg = ATLAS_VEX_SYSTEM_PROMPT + context_block

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=payload.session_id,
            system_message=system_msg,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        reply = await chat.send_message(UserMessage(text=payload.message))
    except Exception as e:
        logger.exception("Atlas Vex chat error")
        raise HTTPException(status_code=502, detail=f"Atlas Vex transmission failed: {type(e).__name__}")

    bot_doc = {
        "id": str(uuid.uuid4()),
        "session_id": payload.session_id,
        "role": "assistant",
        "content": reply,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_messages.insert_one(bot_doc)

    return ChatMessageOut(session_id=payload.session_id, reply=reply)


@api_router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    items = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0, "id": 1, "role": 1, "content": 1, "timestamp": 1},
    ).sort("timestamp", 1).to_list(200)
    return {"session_id": session_id, "messages": items}


@api_router.post("/intake", response_model=IntakeRecord, status_code=201)
async def submit_intake(payload: IntakeCreate, background_tasks: BackgroundTasks):
    """Lead-qualifying intake captured from the Atlas Vex chatbot."""
    obj = IntakeRecord(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.intake_records.insert_one(doc)

    # Mirror to contact_messages for unified inbox
    summary = (
        f"[Atlas Vex Intake]\n"
        f"Project: {obj.project_type}\n"
        f"Timeline: {obj.timeline}\n"
        f"Budget: {obj.budget}\n"
        + (f"Notes: {obj.notes}\n" if obj.notes else "")
        + f"Session: {obj.session_id}"
    )
    await db.contact_messages.insert_one({
        "id": str(uuid.uuid4()),
        "name": obj.name or "Atlas Vex Lead",
        "email": (obj.email or "intake@atlasvex.io"),
        "subject": f"Intake — {obj.project_type}",
        "message": summary,
        "timestamp": obj.timestamp.isoformat(),
    })
    # Fire-and-forget owner notification
    background_tasks.add_task(notify_new_intake, doc)
    return obj


@api_router.get("/github/repos", response_model=List[GithubRepo])
async def github_repos():
    """Aggregate public repos for the three GitHub identities mapped to projects."""
    # 5-minute in-memory cache to avoid hammering the public GitHub API
    now_ts = datetime.now(timezone.utc).timestamp()
    cache = getattr(github_repos, "_cache", None)
    if cache and now_ts - cache["ts"] < 300:
        return cache["data"]

    owners = ["mrmarvel123", "ENZOxNINJA", "AtlasTheDev123"]
    out: List[GithubRepo] = []
    async with httpx.AsyncClient(timeout=10.0) as http:
        for owner in owners:
            try:
                r = await http.get(
                    f"https://api.github.com/users/{owner}/repos",
                    params={"sort": "updated", "per_page": 6},
                    headers={"Accept": "application/vnd.github+json"},
                )
                if r.status_code != 200:
                    continue
                for repo in r.json():
                    out.append(
                        GithubRepo(
                            name=repo.get("name", ""),
                            full_name=repo.get("full_name", ""),
                            description=repo.get("description"),
                            html_url=repo.get("html_url", ""),
                            stargazers_count=repo.get("stargazers_count", 0) or 0,
                            language=repo.get("language"),
                            updated_at=repo.get("updated_at", ""),
                            owner=owner,
                        )
                    )
            except Exception:
                continue
    out.sort(key=lambda r: r.updated_at, reverse=True)
    result = out[:12]
    github_repos._cache = {"ts": now_ts, "data": result}
    return result


# ---------- Admin-only inboxes ----------
@api_router.get("/newsletter", response_model=List[NewsletterSubscriber], dependencies=[Depends(require_admin)])
async def list_newsletter():
    items = await db.newsletter_subs.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for it in items:
        if isinstance(it.get('timestamp'), str):
            it['timestamp'] = datetime.fromisoformat(it['timestamp'])
    return items


@api_router.get("/intake", response_model=List[IntakeRecord], dependencies=[Depends(require_admin)])
async def list_intake():
    items = await db.intake_records.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for it in items:
        if isinstance(it.get('timestamp'), str):
            it['timestamp'] = datetime.fromisoformat(it['timestamp'])
    return items


@api_router.get("/admin/stats", dependencies=[Depends(require_admin)])
async def admin_stats():
    contacts = await db.contact_messages.count_documents({})
    subs = await db.newsletter_subs.count_documents({})
    intakes = await db.intake_records.count_documents({})
    chats = await db.chat_messages.count_documents({})
    sessions = len(await db.chat_messages.distinct("session_id"))
    return {
        "contacts": contacts,
        "newsletter": subs,
        "intakes": intakes,
        "chat_messages": chats,
        "chat_sessions": sessions,
    }


@api_router.get("/admin/verify", dependencies=[Depends(require_admin)])
async def admin_verify():
    """Lightweight ping to validate an admin token from the UI."""
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
