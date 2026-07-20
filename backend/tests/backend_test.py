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
