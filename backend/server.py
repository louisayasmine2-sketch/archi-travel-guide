from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional
import uuid
from datetime import datetime, timezone
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL")
RESEND_TO_EMAIL = os.getenv("RESEND_TO_EMAIL")


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    client.close()


app = FastAPI(title="Archi Travel Guide API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

# ---- Simple in-memory rate limiter (per IP) for public write endpoints ----
# Good enough for a single-instance deployment; put Cloudflare rate rules in
# front of /api for anything high-traffic.
_RATE_WINDOW_SECONDS = 600
_RATE_MAX_REQUESTS = 5
_rate_hits: dict = {}


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    hits = [t for t in _rate_hits.get(ip, []) if now - t < _RATE_WINDOW_SECONDS]
    if len(hits) >= _RATE_MAX_REQUESTS:
        _rate_hits[ip] = hits
        return True
    hits.append(now)
    _rate_hits[ip] = hits
    # keep the table small
    if len(_rate_hits) > 10000:
        _rate_hits.clear()
    return False


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def _notify_contact_email(record, *, message_id: str) -> Optional[str]:
    if not all([RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL]):
        return None

    payload = {
        "from": RESEND_FROM_EMAIL,
        "to": [RESEND_TO_EMAIL],
        "subject": record.subject,
        "reply_to": record.email,
        "html": f"<p><strong>Lead ID:</strong> {message_id}</p><p><strong>Name:</strong> {record.name}</p><p><strong>Email:</strong> {record.email}</p><p><strong>Message:</strong><br/>{record.message}</p>",
        "text": f"Lead ID: {message_id}\nName: {record.name}\nEmail: {record.email}\nMessage:\n{record.message}",
    }
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://api.resend.com/emails",
        json=payload,
        headers=headers,
        timeout=8,
    )

    if response.status_code < 200 or response.status_code >= 300:
        error_text = response.text[:500] if response.text else "no body"
        raise RuntimeError(f"Resend rejected contact email: {response.status_code} {error_text}")

    try:
        data = response.json() if response.content else {}
    except ValueError:
        data = {}
    return data.get("id")


# ============ Models ============

class NewsletterSubscribe(BaseModel):
    email: EmailStr
    source: Optional[str] = "homepage"


class NewsletterRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: str = "homepage"
    created_at: str = Field(default_factory=now_iso)


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=300)
    message: str = Field(min_length=1, max_length=8000)
    # Honeypot: hidden field in the UI; humans leave it empty, bots fill it.
    website: Optional[str] = ""


class ContactRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: str = Field(default_factory=now_iso)


# ============ Endpoints ============

@api_router.get("/")
async def root():
    return {"service": "Archi Travel Guide API", "status": "ok"}


@api_router.post("/newsletter/subscribe")
async def newsletter_subscribe(payload: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        return {"success": True, "already_subscribed": True}
    record = NewsletterRecord(email=payload.email, source=payload.source or "homepage")
    await db.newsletter.insert_one(record.model_dump())
    return {"success": True, "already_subscribed": False}


@api_router.post("/contact")
async def contact_submit(payload: ContactMessage, request: Request):
    # Honeypot tripped -> pretend success, store and send nothing.
    if payload.website:
        logger.info("Contact honeypot tripped; dropping submission silently.")
        return {"success": True, "message": "Thanks — we'll get back to you within 3 business days.", "email_message_id": None}

    client_ip = request.client.host if request.client else "unknown"
    if _rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")

    record = ContactRecord(**payload.model_dump(exclude={"website"}))
    await db.contact_messages.insert_one(record.model_dump())
    email_message_id = None
    try:
        email_message_id = _notify_contact_email(record, message_id=record.id)
    except Exception as e:  # pragma: no cover
        logger.warning("Failed to send contact email: %s", e)

    response = {
        "success": True,
        "message": "Thanks — we'll get back to you within 3 business days.",
        "email_message_id": email_message_id,
    }
    return response


# ============ App wiring ============

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

