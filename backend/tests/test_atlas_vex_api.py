"""Backend API tests for ATLAS VEX portfolio service."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fall back to frontend .env file
    from pathlib import Path
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_returns_service_info(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "ATLAS VEX"
        assert data.get("status") == "online"


# ---------- Contact ----------
class TestContact:
    def test_create_contact_success(self, client):
        payload = {
            "name": "TEST_Jake",
            "email": "test_jake@example.com",
            "message": "TEST_initiating handshake",
            "subject": "TEST_subject",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "timestamp" in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert data["subject"] == payload["subject"]
        assert "_id" not in data

    def test_create_contact_no_subject(self, client):
        r = client.post(
            f"{API}/contact",
            json={
                "name": "TEST_NoSubj",
                "email": "test_nosubj@example.com",
                "message": "TEST_msg without subject",
            },
            timeout=15,
        )
        assert r.status_code == 201
        data = r.json()
        assert data["subject"] is None

    def test_create_contact_invalid_email(self, client):
        r = client.post(
            f"{API}/contact",
            json={"name": "TEST_X", "email": "not-an-email", "message": "hi"},
            timeout=15,
        )
        assert r.status_code == 422

    def test_create_contact_missing_fields(self, client):
        r = client.post(f"{API}/contact", json={"name": "TEST_X"}, timeout=15)
        assert r.status_code == 422

    def test_create_contact_empty_strings(self, client):
        r = client.post(
            f"{API}/contact",
            json={"name": "", "email": "x@y.com", "message": ""},
            timeout=15,
        )
        assert r.status_code == 422

    def test_list_contacts(self, client):
        r = client.get(f"{API}/contact", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Must include at least the messages we just created
        assert len(data) >= 1
        sample = data[0]
        assert "id" in sample
        assert "_id" not in sample
        assert "name" in sample
        assert "email" in sample
        assert "message" in sample
        assert "timestamp" in sample


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_valid_email(self, client):
        import uuid as _uuid
        email = f"test_news_{_uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["email"] == email
        assert "timestamp" in data
        assert "source" in data
        assert data["source"] == "atlasvex-portfolio"
        assert "_id" not in data

    def test_subscribe_idempotent(self, client):
        import uuid as _uuid
        email = f"test_idem_{_uuid.uuid4().hex[:8]}@example.com"
        r1 = client.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r1.status_code == 201
        d1 = r1.json()
        r2 = client.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r2.status_code == 201
        d2 = r2.json()
        assert d1["id"] == d2["id"]
        assert d1["email"] == d2["email"]

    def test_subscribe_invalid_email(self, client):
        r = client.post(f"{API}/newsletter", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422

    def test_subscribe_missing_email(self, client):
        r = client.post(f"{API}/newsletter", json={}, timeout=15)
        assert r.status_code == 422


# ---------- Telemetry ----------
class TestTelemetry:
    def test_telemetry_shape(self, client):
        r = client.get(f"{API}/telemetry", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 4
        labels = {p["label"] for p in data}
        assert {"Agent Sync", "Pipelines", "Memory Nodes", "Threats Blocked"} == labels
        for p in data:
            assert "label" in p and isinstance(p["label"], str)
            assert "value" in p and isinstance(p["value"], (int, float))
            assert "unit" in p and isinstance(p["unit"], str)
