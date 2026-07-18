"""Backend API tests for Archi Travel Guide."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://archi-international.preview.emergentagent.com').rstrip('/')
# Fall back to backend .env if REACT_APP_BACKEND_URL not exported in the shell
if not BASE_URL:
    # read frontend .env
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_root(client):
    r = client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


# ---------- Newsletter ----------
def test_newsletter_subscribe(client):
    email = f"test_nl_{os.urandom(3).hex()}@example.com"
    r = client.post(f"{BASE_URL}/api/newsletter/subscribe", json={"email": email})
    assert r.status_code == 200
    j = r.json()
    assert j["success"] is True
    assert j["already_subscribed"] is False
    # Idempotent
    r2 = client.post(f"{BASE_URL}/api/newsletter/subscribe", json={"email": email})
    assert r2.status_code == 200
    assert r2.json()["already_subscribed"] is True


def test_newsletter_bad_email(client):
    r = client.post(f"{BASE_URL}/api/newsletter/subscribe", json={"email": "not-an-email"})
    assert r.status_code == 422


# ---------- Contact ----------
def test_contact_submit(client):
    payload = {
        "name": "TEST_User",
        "email": "test_contact@example.com",
        "subject": "Hello",
        "message": "This is a test message from backend tests.",
    }
    r = client.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert j["success"] is True
    assert "message" in j


def test_contact_honeypot_silently_accepted(client):
    payload = {
        "name": "TEST_Bot",
        "email": "test_bot@example.com",
        "subject": "Spam",
        "message": "Bot-filled message.",
        "website": "http://spam.example.com",
    }
    r = client.post(f"{BASE_URL}/api/contact", json=payload)
    # Honeypot submissions look successful but nothing is stored or emailed.
    assert r.status_code == 200
    j = r.json()
    assert j["success"] is True
    assert j.get("email_message_id") is None


def test_contact_message_too_long(client):
    payload = {
        "name": "TEST_User",
        "email": "test_contact@example.com",
        "subject": "Hello",
        "message": "x" * 9000,
    }
    r = client.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 422


# ---------- Budget Calculator ----------
@pytest.mark.parametrize("dest", ["Siena", "Tuscany", "Italy", "Europe", "Asia", "Buenos Aires"])
def test_budget_calculator(client, dest):
    payload = {
        "destination": dest,
        "travelers": 2,
        "trip_length": 5,
        "accommodation_level": "mid",
        "food_level": "casual",
        "transport_type": "mixed",
        "activities_level": "moderate",
    }
    r = client.post(f"{BASE_URL}/api/tools/budget-calculator", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["currency"] == "USD"
    assert isinstance(j["estimated_low"], int)
    assert isinstance(j["estimated_high"], int)
    assert j["estimated_high"] > j["estimated_low"] > 0
    assert isinstance(j["tips"], list) and len(j["tips"]) >= 3


def test_budget_validation(client):
    r = client.post(f"{BASE_URL}/api/tools/budget-calculator", json={
        "destination": "Italy", "travelers": 0, "trip_length": 3,
        "accommodation_level": "mid", "food_level": "casual",
        "transport_type": "mixed", "activities_level": "moderate",
    })
    assert r.status_code == 422


# ---------- Itinerary ----------
def test_itinerary(client):
    payload = {
        "destination": "Siena", "trip_length": 3,
        "travel_style": "culture", "party": "couple", "budget_level": "mid",
    }
    r = client.post(f"{BASE_URL}/api/tools/itinerary-generator", json=payload)
    assert r.status_code == 200
    j = r.json()
    assert len(j["days"]) == 3
    assert all(k in j["days"][0] for k in ["day", "morning", "afternoon", "evening"])
    assert j["party_note"]


# ---------- Area Finder ----------
def test_area_finder_known(client):
    r = client.post(f"{BASE_URL}/api/tools/area-finder", json={
        "destination": "Siena", "budget": "mid", "travel_style": "culture",
        "transport_preference": "walk", "nightlife": "low", "family": False,
    })
    assert r.status_code == 200
    j = r.json()
    assert j["recommended_area"]
    assert j["why"]
    assert "budget_note" in j


def test_area_finder_unknown(client):
    r = client.post(f"{BASE_URL}/api/tools/area-finder", json={
        "destination": "Kyoto", "budget": "mid", "travel_style": "culture",
        "transport_preference": "walk", "nightlife": "low", "family": False,
    })
    assert r.status_code == 200
    j = r.json()
    assert j["recommended_area"] == "Historic Centre"


# ---------- Packing ----------
def test_packing(client):
    r = client.post(f"{BASE_URL}/api/tools/packing-checklist", json={
        "destination": "Tuscany", "season": "summer", "trip_length": 10,
    })
    assert r.status_code == 200
    j = r.json()
    cats = j["categories"]
    for expected in ["Clothing", "Weather & Sun", "Documents", "Tech", "Health & Personal", "Smart Extras"]:
        assert expected in cats and len(cats[expected]) > 0


# ---------- Best Time ----------
def test_best_time(client):
    r = client.post(f"{BASE_URL}/api/tools/best-time", json={
        "destination": "Italy", "preference": "good_weather",
    })
    assert r.status_code == 200
    j = r.json()
    assert j["months"]
    assert j["preference"] == "good_weather"


def test_best_time_unknown_fallback(client):
    r = client.post(f"{BASE_URL}/api/tools/best-time", json={
        "destination": "Andorra", "preference": "low_prices",
    })
    assert r.status_code == 200
    assert r.json()["months"]
