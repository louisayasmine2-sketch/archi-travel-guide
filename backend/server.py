from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL")
RESEND_TO_EMAIL = os.getenv("RESEND_TO_EMAIL")

app = FastAPI(title="Archi Travel Guide API")
api_router = APIRouter(prefix="/api")


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
        "text": f"Lead ID: {message_id}\\nName: {record.name}\\nEmail: {record.email}\\nMessage:\\n{record.message}",
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
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: str = Field(default_factory=now_iso)


# Travel Tools payloads

class BudgetInput(BaseModel):
    destination: str
    travelers: int = Field(ge=1, le=20)
    trip_length: int = Field(ge=1, le=90)
    accommodation_level: Literal["budget", "mid", "luxury"]
    food_level: Literal["street", "casual", "fine"]
    transport_type: Literal["public", "mixed", "private"]
    activities_level: Literal["light", "moderate", "packed"]


class ItineraryInput(BaseModel):
    destination: str
    trip_length: int = Field(ge=1, le=14)
    travel_style: Literal["culture", "food", "nature", "mix"]
    party: Literal["solo", "couple", "family", "friends"]
    budget_level: Literal["budget", "mid", "luxury"]


class AreaFinderInput(BaseModel):
    destination: str
    budget: Literal["budget", "mid", "luxury"]
    travel_style: Literal["culture", "food", "nature", "mix"]
    transport_preference: Literal["walk", "public", "car"]
    nightlife: Literal["low", "some", "high"]
    family: bool = False


class PackingInput(BaseModel):
    destination: str
    season: Literal["spring", "summer", "autumn", "winter"]
    trip_length: int = Field(ge=1, le=60)


class BestTimeInput(BaseModel):
    destination: str
    preference: Literal["good_weather", "low_crowds", "low_prices", "festivals"]


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
async def contact_submit(payload: ContactMessage):
    record = ContactRecord(**payload.model_dump())
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


# ---- Budget Calculator ----

_BUDGET_RATES = {
    # Per person per day, USD, base rates
    "italy":   {"food": {"street": 20, "casual": 45, "fine": 110},
                "stay": {"budget": 45, "mid": 130, "luxury": 320},
                "trans": {"public": 12, "mixed": 30, "private": 70},
                "act":   {"light": 10, "moderate": 30, "packed": 65}},
    "tuscany": {"food": {"street": 22, "casual": 50, "fine": 120},
                "stay": {"budget": 55, "mid": 145, "luxury": 360},
                "trans": {"public": 14, "mixed": 35, "private": 85},
                "act":   {"light": 10, "moderate": 35, "packed": 75}},
    "siena":   {"food": {"street": 18, "casual": 42, "fine": 105},
                "stay": {"budget": 50, "mid": 125, "luxury": 300},
                "trans": {"public": 8,  "mixed": 22, "private": 60},
                "act":   {"light": 8,  "moderate": 28, "packed": 60}},
    "europe":  {"food": {"street": 22, "casual": 48, "fine": 115},
                "stay": {"budget": 55, "mid": 140, "luxury": 340},
                "trans": {"public": 14, "mixed": 32, "private": 75},
                "act":   {"light": 12, "moderate": 32, "packed": 70}},
    "asia":    {"food": {"street": 8,  "casual": 22, "fine": 65},
                "stay": {"budget": 22, "mid": 75,  "luxury": 220},
                "trans": {"public": 5,  "mixed": 15, "private": 45},
                "act":   {"light": 8,  "moderate": 22, "packed": 55}},
    "global":  {"food": {"street": 18, "casual": 42, "fine": 100},
                "stay": {"budget": 45, "mid": 120, "luxury": 300},
                "trans": {"public": 12, "mixed": 28, "private": 70},
                "act":   {"light": 10, "moderate": 28, "packed": 60}},
}


def _rate_bucket(destination: str) -> dict:
    key = (destination or "").strip().lower()
    for k in _BUDGET_RATES.keys():
        if k in key:
            return _BUDGET_RATES[k]
    return _BUDGET_RATES["global"]


@api_router.post("/tools/budget-calculator")
async def budget_calculator(payload: BudgetInput):
    rates = _rate_bucket(payload.destination)
    per_person_day = (
        rates["food"][payload.food_level]
        + rates["stay"][payload.accommodation_level] / max(payload.travelers, 1) * 1.6
        + rates["trans"][payload.transport_type]
        + rates["act"][payload.activities_level]
    )
    base_total = per_person_day * payload.travelers * payload.trip_length
    low = round(base_total * 0.9, -1)
    high = round(base_total * 1.25, -1)
    tips = [
        "Book accommodation 6–8 weeks ahead for the best rates.",
        "Mix casual meals with one memorable dinner per 2–3 days to control food costs.",
        "Use regional trains and buses — they’re reliable and up to 60% cheaper than taxis.",
    ]
    if payload.accommodation_level == "luxury":
        tips.append("Consider one 'showcase' hotel night and mid-range for the rest — same trip, ~30% lower cost.")
    if payload.activities_level == "packed":
        tips.append("Buy city passes or bundled tickets — they typically save 15–25% on top attractions.")
    return {
        "currency": "USD",
        "per_person_per_day": round(per_person_day, 2),
        "estimated_low": int(low),
        "estimated_high": int(high),
        "tips": tips,
    }


# ---- Itinerary Generator ----

_ITIN_TEMPLATES = {
    "siena": [
        ("Piazza del Campo & Palazzo Pubblico", "Torre del Mangia climb", "Sunset aperitivo on the Campo"),
        ("Siena Cathedral & Piccolomini Library", "Museo dell’Opera & Panorama dal Facciatone", "Enoteca dinner in Terzo di Città"),
        ("Contrada walking tour", "Pinacoteca Nazionale", "Trattoria dinner near Fontebranda"),
        ("Day trip: San Gimignano & Monteriggioni", "Return to Siena", "Evening passeggiata"),
        ("Day trip: Val d’Orcia (Pienza, Montalcino)", "Wine tasting", "Slow dinner in the countryside"),
    ],
    "tuscany": [
        ("Florence: Duomo, Uffizi highlights", "Ponte Vecchio walk", "Trattoria in Oltrarno"),
        ("Siena: Piazza del Campo, Duomo", "Terzo di Città stroll", "Enoteca dinner"),
        ("Val d’Orcia road trip", "Pienza & Montalcino", "Brunello tasting"),
        ("San Gimignano & Volterra", "Etruscan sites", "Countryside agriturismo dinner"),
        ("Chianti wine route", "Castello tour", "Vineyard picnic"),
    ],
    "italy": [
        ("Rome: Colosseum & Roman Forum", "Palatine Hill", "Trastevere dinner"),
        ("Rome: Vatican Museums & St Peter’s", "Sunset at Pincio", "Piazza Navona evening"),
        ("Florence: Duomo & Uffizi", "Ponte Vecchio", "Oltrarno dinner"),
        ("Siena day trip", "Piazza del Campo & Duomo", "Return to Florence"),
        ("Venice: San Marco & Doge’s Palace", "Cannaregio walk", "Cicchetti crawl"),
    ],
    "default": [
        ("Arrival & neighborhood orientation", "Signature landmark visit", "Local dinner in a walkable area"),
        ("Main museum or historic site", "Café break & shopping", "Rooftop or riverside dinner"),
        ("Half-day guided experience", "Free-time exploration", "Food market crawl"),
        ("Day trip to nearby region", "Return by early evening", "Slow dinner"),
        ("Off-the-beaten-path neighborhood", "Local workshop or class", "Farewell dinner"),
    ],
}


@api_router.post("/tools/itinerary-generator")
async def itinerary_generator(payload: ItineraryInput):
    dest = payload.destination.strip().lower()
    template = _ITIN_TEMPLATES.get("default")
    for key, tpl in _ITIN_TEMPLATES.items():
        if key in dest:
            template = tpl
            break
    days = []
    for i in range(payload.trip_length):
        base = template[i % len(template)]
        days.append({
            "day": i + 1,
            "morning": base[0],
            "afternoon": base[1],
            "evening": base[2],
        })
    tone = {
        "family": "Includes shorter walking blocks, gelato breaks, and family-friendly restaurants.",
        "couple": "Balances iconic sights with quieter, romantic corners and sunset viewpoints.",
        "solo":   "Optimised for walkability, cafés with wifi, and safe evening neighborhoods.",
        "friends": "Adds evening enoteca stops and shared tasting menus.",
    }[payload.party]
    return {
        "destination": payload.destination,
        "trip_length": payload.trip_length,
        "style": payload.travel_style,
        "party_note": tone,
        "budget_level": payload.budget_level,
        "days": days,
    }


# ---- Area Finder ----

_AREA_MAP = {
    "siena": {
        "walk_family":   ("Terzo di Città", "Quiet, elegant streets steps from the Duomo and Piazza del Campo — the calmest of the three terzi."),
        "walk_night":    ("Terzo di San Martino", "Lively enotecas, walkable to the Campo, great for evening passeggiata."),
        "public_default":("Near Porta Camollia", "Just outside the historic core with easy access to buses and the train station."),
        "default":       ("Terzo di Camollia", "Best mix of authentic residential feel, affordable stays, and short walks into the centre."),
    },
    "florence": {
        "walk_default":  ("Santa Croce", "Central, walkable, packed with trattorias yet quieter than the Duomo area."),
        "night":         ("Santo Spirito (Oltrarno)", "Artisan workshops by day, buzzing wine bars by night."),
        "family":        ("San Marco", "Green squares, museums, and easy tram access to the outskirts."),
        "default":       ("Santa Maria Novella", "Practical base near the train station with a growing food scene."),
    },
    "rome": {
        "walk_default":  ("Monti", "Cobbled lanes, indie cafés, walking distance to the Forum and Colosseum."),
        "family":        ("Prati", "Wide sidewalks, grocery stores, and safe streets near the Vatican."),
        "night":         ("Trastevere", "The classic evening neighborhood — pick a side street for lower noise."),
        "default":       ("Centro Storico", "The heart of Rome; you’ll walk to nearly everything."),
    },
}


@api_router.post("/tools/area-finder")
async def area_finder(payload: AreaFinderInput):
    dest = payload.destination.strip().lower()
    city = None
    for k in _AREA_MAP.keys():
        if k in dest:
            city = k
            break
    if not city:
        return {
            "destination": payload.destination,
            "recommended_area": "Historic Centre",
            "why": "For most cities we recommend staying near the historic centre for a first visit — you’ll cut transport time and see more on foot. Look for streets 5–10 minutes off the main square to avoid noise.",
            "runner_up": "Neighborhood One Metro/Bus Ring Out",
            "runner_up_why": "Quieter and 20–35% cheaper, still 15–20 minutes to the main sights.",
        }

    m = _AREA_MAP[city]
    # priority: family > nightlife > walkability
    key = "default"
    if payload.family and "family" in m:
        key = "family"
    elif payload.nightlife == "high" and "night" in m:
        key = "night"
    elif payload.transport_preference == "walk" and "walk_default" in m:
        key = "walk_default"
    elif payload.transport_preference == "walk" and "walk_family" in m and payload.family:
        key = "walk_family"
    elif payload.transport_preference == "public" and "public_default" in m:
        key = "public_default"

    area, why = m[key]
    return {
        "destination": payload.destination.title(),
        "recommended_area": area,
        "why": why,
        "budget_note": {
            "budget": "Look at guesthouses and B&Bs on the edge of this area for 25–40% lower rates.",
            "mid":    "Boutique 3–4★ hotels here offer the best value.",
            "luxury": "Small design hotels and historic residences in this area punch well above chains.",
        }[payload.budget],
    }


# ---- Packing Checklist ----

_PACKING = {
    "spring": {
        "clothing": ["Light layers", "Waterproof jacket", "Comfortable walking shoes", "1 warm sweater", "Scarf for churches"],
        "weather":  ["Compact umbrella", "Sunglasses", "SPF 30 sunscreen"],
    },
    "summer": {
        "clothing": ["Breathable T-shirts", "Linen shirt or blouse", "Walking sandals", "Light cardigan for evenings", "Modest cover-up for churches"],
        "weather":  ["Wide-brim hat", "Sunglasses", "SPF 50 sunscreen", "Refillable water bottle"],
    },
    "autumn": {
        "clothing": ["Layered tops", "Light wool sweater", "Waterproof shoes", "Rain jacket", "Scarf"],
        "weather":  ["Compact umbrella", "Sunglasses", "SPF 30"],
    },
    "winter": {
        "clothing": ["Warm coat", "Thermal base layer", "Waterproof boots", "Gloves & beanie", "Wool scarf"],
        "weather":  ["Compact umbrella", "SPF 30", "Lip balm"],
    },
}


@api_router.post("/tools/packing-checklist")
async def packing_checklist(payload: PackingInput):
    base = _PACKING[payload.season]
    categories = {
        "Clothing": base["clothing"],
        "Weather & Sun": base["weather"],
        "Documents": ["Passport / ID", "Printed hotel confirmations", "Travel insurance card", "Credit card + backup card", "Local currency (small notes)"],
        "Tech": ["Phone + charger", "EU adapter", "Portable power bank", "Headphones", "Offline maps downloaded"],
        "Health & Personal": ["Prescription meds (in original packaging)", "Small first-aid kit", "Reusable water bottle", "Hand sanitiser", "Personal toiletries"],
        "Smart Extras": ["Foldable daypack", "Packing cubes", "Microfiber travel towel", "Notebook + pen", "Snack bars for long transit days"],
    }
    if payload.trip_length >= 7:
        categories["Smart Extras"].append("Laundry sheets or small detergent")
    if payload.trip_length >= 14:
        categories["Smart Extras"].append("Compression bag for dirty laundry")
    return {"season": payload.season, "trip_length": payload.trip_length, "categories": categories}


# ---- Best Time to Visit ----

_BEST_TIME = {
    "italy":   {"good_weather": ("May–June, September", "Warm days, manageable crowds, produce at its peak."),
                "low_crowds":   ("Late October–March (excl. Christmas)", "Cool but very quiet; ideal for museums and cities."),
                "low_prices":   ("November & February", "Best flight and hotel rates outside holidays."),
                "festivals":    ("July (Palio), August (Ferragosto), December (markets)", "Iconic events, but book months ahead.")},
    "tuscany": {"good_weather": ("May, June, September", "Perfect countryside light and mild days."),
                "low_crowds":   ("March–April, mid-October", "Vineyards and hilltowns feel local again."),
                "low_prices":   ("November–March", "Agriturismos discount 30–50%."),
                "festivals":    ("Late September (harvest), Palio in Siena on Jul 2 & Aug 16", "Book stays 4–6 months ahead.")},
    "siena":   {"good_weather": ("May, June, September", "T-shirt days, cool evenings."),
                "low_crowds":   ("Late Feb–March, November", "The Campo returns to locals."),
                "low_prices":   ("Nov–March (excl. Palio)", "Family-run hotels drop rates significantly."),
                "festivals":    ("Palio: July 2 & August 16", "Book 6–9 months ahead; standing room in the Campo is free.")},
    "europe":  {"good_weather": ("May–September", "Long daylight, café terraces open."),
                "low_crowds":   ("October–March", "Fewer queues at major sites."),
                "low_prices":   ("Late January–February, November", "Best hotel rates outside holidays."),
                "festivals":    ("Christmas markets (Dec), Carnival (Feb–Mar), summer festivals (Jun–Aug)", "")},
    "asia":    {"good_weather": ("November–February", "Dry season for most of SE Asia."),
                "low_crowds":   ("May–early June, September", "Shoulder months with better rates."),
                "low_prices":   ("May–September (shoulder)", "Rain risk but sharp discounts."),
                "festivals":    ("Lunar New Year (Jan–Feb), Songkran (Apr), Diwali (Oct–Nov)", "")},
}


@api_router.post("/tools/best-time")
async def best_time(payload: BestTimeInput):
    dest = payload.destination.strip().lower()
    bucket = None
    for k in _BEST_TIME.keys():
        if k in dest:
            bucket = _BEST_TIME[k]
            break
    if not bucket:
        bucket = _BEST_TIME["europe"]
    months, note = bucket[payload.preference]
    return {"destination": payload.destination, "preference": payload.preference, "months": months, "note": note}


# ============ App wiring ============

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
