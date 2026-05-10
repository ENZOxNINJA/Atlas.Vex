"""Backend API tests for ATLAS VEX iteration 3 — chat (LLM) + github."""
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


# ---------- Chat (LLM-backed; keep calls minimal) ----------
class TestChat:
    SESSION_ID = f"test-sess-{uuid.uuid4().hex[:10]}"

    def test_chat_empty_message_422(self, client):
        r = client.post(
            f"{API}/chat",
            json={"session_id": self.SESSION_ID, "message": ""},
            timeout=15,
        )
        assert r.status_code == 422

    def test_chat_missing_fields_422(self, client):
        r = client.post(f"{API}/chat", json={"message": "hi"}, timeout=15)
        assert r.status_code == 422

    def test_chat_send_message_returns_atlas_vex_reply(self, client):
        # Single real LLM call to keep cost low.
        r = client.post(
            f"{API}/chat",
            json={
                "session_id": self.SESSION_ID,
                "message": "Who is Alan Marvel? Reply in one short sentence.",
            },
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"] == self.SESSION_ID
        assert "reply" in data and isinstance(data["reply"], str)
        assert len(data["reply"]) > 5
        assert "timestamp" in data
        # Reply should mention Alan or ATLAS VEX context
        text = data["reply"].lower()
        assert ("alan" in text) or ("atlas" in text) or ("vex" in text) or ("marvel" in text), (
            f"Reply did not reference canon: {data['reply']!r}"
        )

    def test_chat_history_returns_messages(self, client):
        r = client.get(f"{API}/chat/history/{self.SESSION_ID}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["session_id"] == self.SESSION_ID
        assert isinstance(data["messages"], list)
        # After previous test we should have user + assistant pair (≥2)
        assert len(data["messages"]) >= 2
        roles = {m["role"] for m in data["messages"]}
        assert "user" in roles and "assistant" in roles
        for m in data["messages"]:
            assert "_id" not in m
            assert "content" in m and "role" in m and "timestamp" in m

    def test_chat_history_unknown_session_empty(self, client):
        r = client.get(f"{API}/chat/history/no-such-session-xyz-{uuid.uuid4().hex[:6]}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["messages"] == []


# ---------- GitHub aggregator ----------
class TestGithubRepos:
    def test_github_repos_returns_list(self, client):
        r = client.get(f"{API}/github/repos", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        # Real GitHub call - may be rate-limited or empty for a user; but at least one of three should yield something.
        # If completely empty, treat as flaky/rate-limit and skip rather than fail.
        if not data:
            pytest.skip("GitHub API returned no repos (likely rate-limited in CI).")
        assert len(data) <= 12  # capped
        sample = data[0]
        for k in ("name", "full_name", "html_url", "owner", "updated_at", "stargazers_count"):
            assert k in sample
        owners = {r_["owner"] for r_ in data}
        assert owners.issubset({"mrmarvel123", "ENZOxNINJA", "AtlasTheDev123"})
        assert len(owners) >= 1


# ---------- Regression on existing endpoints ----------
class TestRegression:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("service") == "ATLAS VEX"

    def test_contact_create(self, client):
        r = client.post(
            f"{API}/contact",
            json={
                "name": "TEST_v3",
                "email": "test_v3@example.com",
                "message": "TEST_iter3 regression",
            },
            timeout=15,
        )
        assert r.status_code == 201

    def test_newsletter_create(self, client):
        email = f"test_v3_{uuid.uuid4().hex[:8]}@example.com"
        r = client.post(f"{API}/newsletter", json={"email": email}, timeout=15)
        assert r.status_code == 201

    def test_telemetry(self, client):
        r = client.get(f"{API}/telemetry", timeout=15)
        assert r.status_code == 200
        assert len(r.json()) == 4
