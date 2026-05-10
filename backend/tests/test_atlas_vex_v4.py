"""Backend API tests for ATLAS VEX iteration 4 — POST /api/intake + regression."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
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


# ---------- Intake endpoint (NEW in iter 4) ----------
class TestIntake:
    def test_intake_full_payload_creates_record(self, client):
        sid = f"sess-{uuid.uuid4().hex[:10]}"
        payload = {
            "session_id": sid,
            "project_type": "Autonomous Agent Platform",
            "timeline": "4–8 weeks",
            "budget": "$10k–$25k",
            "name": "TEST_intake",
            "email": "test_intake@example.com",
            "notes": "TEST iter4 intake",
        }
        r = client.post(f"{API}/intake", json=payload, timeout=20)
        assert r.status_code == 201, r.text
        data = r.json()
        # Required fields in IntakeRecord
        for k in ("id", "session_id", "project_type", "timeline", "budget", "timestamp"):
            assert k in data, f"missing {k} in response"
        assert data["session_id"] == sid
        assert data["project_type"] == payload["project_type"]
        assert data["timeline"] == payload["timeline"]
        assert data["budget"] == payload["budget"]
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        assert data["notes"] == payload["notes"]
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        # No mongo _id leak
        assert "_id" not in data

    def test_intake_minimal_payload_optional_fields(self, client):
        sid = f"sess-{uuid.uuid4().hex[:10]}"
        payload = {
            "session_id": sid,
            "project_type": "AI Infrastructure",
            "timeline": "2–6 months",
            "budget": "Let's discuss",
        }
        r = client.post(f"{API}/intake", json=payload, timeout=20)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["session_id"] == sid
        assert data["email"] is None
        assert data["name"] is None
        assert data["notes"] is None

    def test_intake_mirrors_into_contact_messages(self, client):
        sid = f"sess-mirror-{uuid.uuid4().hex[:8]}"
        unique_proj = f"TEST_MIRROR_{uuid.uuid4().hex[:6]}"
        payload = {
            "session_id": sid,
            "project_type": unique_proj,
            "timeline": "< 4 weeks",
            "budget": "$5k–$10k",
            "email": "mirror@example.com",
            "notes": "mirror check",
        }
        r = client.post(f"{API}/intake", json=payload, timeout=20)
        assert r.status_code == 201, r.text

        # Verify mirror by listing /api/contact and finding our unique subject
        rc = client.get(f"{API}/contact", timeout=15)
        assert rc.status_code == 200
        contacts = rc.json()
        match = [c for c in contacts if c.get("subject") == f"Intake — {unique_proj}"]
        assert len(match) >= 1, f"intake not mirrored to contact_messages (subject not found)"
        m = match[0]
        assert sid in m["message"]
        assert unique_proj in m["message"]
        assert m["email"] == "mirror@example.com"

    def test_intake_missing_required_field_422(self, client):
        # Missing budget
        r = client.post(
            f"{API}/intake",
            json={
                "session_id": "sess-x",
                "project_type": "X",
                "timeline": "Y",
            },
            timeout=15,
        )
        assert r.status_code == 422

    def test_intake_missing_session_id_422(self, client):
        r = client.post(
            f"{API}/intake",
            json={
                "project_type": "X",
                "timeline": "Y",
                "budget": "Z",
            },
            timeout=15,
        )
        assert r.status_code == 422

    def test_intake_invalid_email_422(self, client):
        r = client.post(
            f"{API}/intake",
            json={
                "session_id": "sess-bad-email",
                "project_type": "X",
                "timeline": "Y",
                "budget": "Z",
                "email": "not-an-email",
            },
            timeout=15,
        )
        assert r.status_code == 422

    def test_intake_empty_required_field_422(self, client):
        r = client.post(
            f"{API}/intake",
            json={
                "session_id": "sess-empty",
                "project_type": "",
                "timeline": "Y",
                "budget": "Z",
            },
            timeout=15,
        )
        assert r.status_code == 422


# ---------- Regression: existing endpoints still work ----------
class TestRegression:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("service") == "ATLAS VEX"

    def test_contact_create(self, client):
        r = client.post(
            f"{API}/contact",
            json={
                "name": "TEST_v4",
                "email": "test_v4@example.com",
                "message": "TEST_iter4 regression",
            },
            timeout=15,
        )
        assert r.status_code == 201
        data = r.json()
        assert data["email"] == "test_v4@example.com"
        assert "id" in data
        assert "_id" not in data

    def test_newsletter_create(self, client):
        email = f"test_v4_{uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 201
        data = r.json()
        assert data["email"] == email

    def test_telemetry(self, client):
        r = client.get(f"{API}/telemetry", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 4
        labels = {it["label"] for it in items}
        assert "Agent Sync" in labels

    def test_github_repos(self, client):
        r = client.get(f"{API}/github/repos", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if not data:
            pytest.skip("GitHub API rate-limited / empty.")

    def test_chat_smoke_one_call(self, client):
        # Minimal LLM call to confirm /api/chat still works (1 call max for cost)
        sid = f"test-v4-chat-{uuid.uuid4().hex[:6]}"
        r = client.post(
            f"{API}/chat",
            json={"session_id": sid, "message": "Reply 'ok' in one word."},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"] == sid
        assert isinstance(data["reply"], str) and len(data["reply"]) > 0
