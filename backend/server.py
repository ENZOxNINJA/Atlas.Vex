from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="ATLAS VEX API")
api_router = APIRouter(prefix="/api")


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


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "ATLAS VEX", "status": "online"}


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactMessageCreate):
    obj = ContactMessage(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_messages.insert_one(doc)
    return obj


@api_router.get("/contact", response_model=List[ContactMessage])
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
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db.newsletter_subs.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        if isinstance(existing.get('timestamp'), str):
            existing['timestamp'] = datetime.fromisoformat(existing['timestamp'])
        return NewsletterSubscriber(**existing)
    obj = NewsletterSubscriber(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.newsletter_subs.insert_one(doc)
    return obj


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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
