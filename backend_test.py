#!/usr/bin/env python3
"""
ATLAS VEX Backend API Test Suite
Tests admin token gating, public endpoints, lifespan migration, and Phase 4 email notifications
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://repo-analyzer-227.preview.emergentagent.com/api"
ADMIN_TOKEN = "atlasvex-admin-2026-change-me"
ADMIN_HEADERS = {"X-Admin-Token": ADMIN_TOKEN}
WRONG_TOKEN_HEADERS = {"X-Admin-Token": "wrong-token-123"}

# Test data
TEST_SESSION_ID = f"test-session-{uuid.uuid4().hex[:8]}"
TEST_EMAIL = f"test.engineer.{uuid.uuid4().hex[:6]}@atlasvex.io"
TEST_CONTACT_EMAIL = f"john.smith.{uuid.uuid4().hex[:6]}@techcorp.com"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}


def log_test(name, passed, details=""):
    """Log test result"""
    if passed:
        test_results["passed"].append(name)
        print(f"✅ PASS: {name}")
    else:
        test_results["failed"].append({"name": name, "details": details})
        print(f"❌ FAIL: {name}")
        if details:
            print(f"   Details: {details}")


def log_warning(name, details):
    """Log warning (non-critical issue)"""
    test_results["warnings"].append({"name": name, "details": details})
    print(f"⚠️  WARNING: {name} - {details}")


print("=" * 80)
print("ATLAS VEX Backend API Test Suite")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print(f"Admin Token: {ADMIN_TOKEN[:20]}...")
print()
print("PHASE 4 FOCUS: Email notifications (fire-and-forget via BackgroundTasks)")
print("- POST /api/contact, /api/newsletter, /api/intake must return 201 quickly (<1s)")
print("- Email failures logged in backend.err.log but should NOT block API response")
print("- Resend test mode: emails only deliver to alanmarvel5@gmail.com")
print("=" * 80)
print()

# ============================================================================
# TEST 1: Admin Auth Dependency
# ============================================================================
print("TEST SUITE 1: Admin Auth Dependency (X-Admin-Token)")
print("-" * 80)

# Test 1.1: /api/admin/verify with valid token
try:
    response = requests.get(f"{BASE_URL}/admin/verify", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200 and response.json().get("ok") is True:
        log_test("Admin verify with valid token returns 200 {ok: true}", True)
    else:
        log_test("Admin verify with valid token returns 200 {ok: true}", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Admin verify with valid token returns 200 {ok: true}", False, str(e))

# Test 1.2: /api/admin/verify with wrong token
try:
    response = requests.get(f"{BASE_URL}/admin/verify", headers=WRONG_TOKEN_HEADERS, timeout=10)
    if response.status_code == 401:
        log_test("Admin verify with wrong token returns 401", True)
    else:
        log_test("Admin verify with wrong token returns 401", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Admin verify with wrong token returns 401", False, str(e))

# Test 1.3: /api/admin/verify with NO token header
try:
    response = requests.get(f"{BASE_URL}/admin/verify", timeout=10)
    if response.status_code == 401:
        log_test("Admin verify with no token returns 401", True)
    else:
        log_test("Admin verify with no token returns 401", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Admin verify with no token returns 401", False, str(e))

# Test 1.4: /api/admin/stats with valid token
try:
    response = requests.get(f"{BASE_URL}/admin/stats", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200:
        data = response.json()
        required_keys = ["contacts", "newsletter", "intakes", "chat_messages", "chat_sessions"]
        if all(key in data for key in required_keys):
            log_test("Admin stats with valid token returns 200 with all required keys", True)
        else:
            missing = [k for k in required_keys if k not in data]
            log_test("Admin stats with valid token returns 200 with all required keys", False, 
                    f"Missing keys: {missing}")
    else:
        log_test("Admin stats with valid token returns 200 with all required keys", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Admin stats with valid token returns 200 with all required keys", False, str(e))

print()

# ============================================================================
# TEST 2: /api/contact Gating
# ============================================================================
print("TEST SUITE 2: /api/contact Gating")
print("-" * 80)

# Test 2.1: POST /api/contact (no token) with valid body - PHASE 4: Check response time
contact_payload = {
    "name": "John Smith",
    "email": TEST_CONTACT_EMAIL,
    "message": "I'm interested in discussing an autonomous systems project for our enterprise platform.",
    "subject": "Enterprise AI Systems Consultation"
}
created_contact_id = None

try:
    start_time = time.time()
    response = requests.post(f"{BASE_URL}/contact", json=contact_payload, timeout=10)
    response_time = time.time() - start_time
    
    if response.status_code == 201:
        data = response.json()
        if "id" in data and "timestamp" in data and data.get("email") == TEST_CONTACT_EMAIL:
            created_contact_id = data["id"]
            log_test("POST /api/contact (no token) returns 201 with id and timestamp", True)
            # Phase 4: Verify response time is under 1 second (email is fire-and-forget)
            if response_time < 1.0:
                log_test("POST /api/contact returns quickly (<1s) - email is fire-and-forget", True)
            else:
                log_warning("POST /api/contact response time", 
                           f"Response took {response_time:.2f}s (expected <1s). Email may be blocking.")
                log_test("POST /api/contact returns quickly (<1s) - email is fire-and-forget", False,
                        f"Response time: {response_time:.2f}s (expected <1s)")
        else:
            log_test("POST /api/contact (no token) returns 201 with id and timestamp", False, 
                    f"Missing fields or wrong email. Response: {data}")
    else:
        log_test("POST /api/contact (no token) returns 201 with id and timestamp", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("POST /api/contact (no token) returns 201 with id and timestamp", False, str(e))

# Test 2.2: GET /api/contact (no token) should return 401
try:
    response = requests.get(f"{BASE_URL}/contact", timeout=10)
    if response.status_code == 401:
        log_test("GET /api/contact (no token) returns 401", True)
    else:
        log_test("GET /api/contact (no token) returns 401", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/contact (no token) returns 401", False, str(e))

# Test 2.3: GET /api/contact (valid token) should return 200 with list including created contact
try:
    response = requests.get(f"{BASE_URL}/contact", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if created_contact_id:
                found = any(item.get("id") == created_contact_id for item in data)
                if found:
                    log_test("GET /api/contact (valid token) returns 200 list including created contact", True)
                else:
                    log_test("GET /api/contact (valid token) returns 200 list including created contact", False, 
                            f"Created contact ID {created_contact_id} not found in list")
            else:
                log_test("GET /api/contact (valid token) returns 200 list including created contact", True)
        else:
            log_test("GET /api/contact (valid token) returns 200 list including created contact", False, 
                    f"Response is not a list: {type(data)}")
    else:
        log_test("GET /api/contact (valid token) returns 200 list including created contact", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/contact (valid token) returns 200 list including created contact", False, str(e))

print()

# ============================================================================
# TEST 3: /api/newsletter
# ============================================================================
print("TEST SUITE 3: /api/newsletter")
print("-" * 80)

# Test 3.1: POST /api/newsletter (no token) with valid email - PHASE 4: Check response time
newsletter_payload = {
    "email": TEST_EMAIL,
    "source": "atlasvex-portfolio"
}
created_subscriber_id = None

try:
    start_time = time.time()
    response = requests.post(f"{BASE_URL}/newsletter", json=newsletter_payload, timeout=10)
    response_time = time.time() - start_time
    
    if response.status_code == 201:
        data = response.json()
        if "id" in data and data.get("email") == TEST_EMAIL:
            created_subscriber_id = data["id"]
            log_test("POST /api/newsletter (no token) returns 201 with subscriber", True)
            # Phase 4: Verify response time is under 1 second
            if response_time < 1.0:
                log_test("POST /api/newsletter returns quickly (<1s) - email is fire-and-forget", True)
            else:
                log_warning("POST /api/newsletter response time", 
                           f"Response took {response_time:.2f}s (expected <1s). Email may be blocking.")
                log_test("POST /api/newsletter returns quickly (<1s) - email is fire-and-forget", False,
                        f"Response time: {response_time:.2f}s (expected <1s)")
        else:
            log_test("POST /api/newsletter (no token) returns 201 with subscriber", False, 
                    f"Missing id or wrong email. Response: {data}")
    else:
        log_test("POST /api/newsletter (no token) returns 201 with subscriber", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("POST /api/newsletter (no token) returns 201 with subscriber", False, str(e))

# Test 3.2: POST /api/newsletter same email again (idempotent)
try:
    response = requests.post(f"{BASE_URL}/newsletter", json=newsletter_payload, timeout=10)
    if response.status_code == 201:
        data = response.json()
        if data.get("id") == created_subscriber_id and data.get("email") == TEST_EMAIL:
            log_test("POST /api/newsletter same email returns 201 idempotent (same id)", True)
        else:
            log_test("POST /api/newsletter same email returns 201 idempotent (same id)", False, 
                    f"Different ID returned. First: {created_subscriber_id}, Second: {data.get('id')}")
    else:
        log_test("POST /api/newsletter same email returns 201 idempotent (same id)", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("POST /api/newsletter same email returns 201 idempotent (same id)", False, str(e))

# Test 3.3: GET /api/newsletter (no token) should return 401
try:
    response = requests.get(f"{BASE_URL}/newsletter", timeout=10)
    if response.status_code == 401:
        log_test("GET /api/newsletter (no token) returns 401", True)
    else:
        log_test("GET /api/newsletter (no token) returns 401", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/newsletter (no token) returns 401", False, str(e))

# Test 3.4: GET /api/newsletter (valid token) should return 200 with list
try:
    response = requests.get(f"{BASE_URL}/newsletter", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if created_subscriber_id:
                found = any(item.get("id") == created_subscriber_id for item in data)
                if found:
                    log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", True)
                else:
                    log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", False, 
                            f"Created subscriber ID {created_subscriber_id} not found in list")
            else:
                log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", True)
        else:
            log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", False, 
                    f"Response is not a list: {type(data)}")
    else:
        log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/newsletter (valid token) returns 200 list including subscriber", False, str(e))

print()

# ============================================================================
# TEST 4: /api/intake
# ============================================================================
print("TEST SUITE 4: /api/intake")
print("-" * 80)

# Test 4.1: POST /api/intake (no token) with required fields - PHASE 4: Check response time
intake_payload = {
    "session_id": TEST_SESSION_ID,
    "project_type": "Autonomous Multi-Agent System",
    "timeline": "Q3 2026",
    "budget": "$50k-$100k",
    "name": "Sarah Chen",
    "email": f"sarah.chen.{uuid.uuid4().hex[:6]}@innovate.ai",
    "notes": "Looking to build a distributed AI orchestration platform similar to LEGION CORE"
}
created_intake_id = None

try:
    start_time = time.time()
    response = requests.post(f"{BASE_URL}/intake", json=intake_payload, timeout=10)
    response_time = time.time() - start_time
    
    if response.status_code == 201:
        data = response.json()
        if "id" in data and data.get("session_id") == TEST_SESSION_ID:
            created_intake_id = data["id"]
            log_test("POST /api/intake (no token) returns 201 with intake record", True)
            # Phase 4: Verify response time is under 1 second
            if response_time < 1.0:
                log_test("POST /api/intake returns quickly (<1s) - email is fire-and-forget", True)
            else:
                log_warning("POST /api/intake response time", 
                           f"Response took {response_time:.2f}s (expected <1s). Email may be blocking.")
                log_test("POST /api/intake returns quickly (<1s) - email is fire-and-forget", False,
                        f"Response time: {response_time:.2f}s (expected <1s)")
        else:
            log_test("POST /api/intake (no token) returns 201 with intake record", False, 
                    f"Missing id or wrong session_id. Response: {data}")
    else:
        log_test("POST /api/intake (no token) returns 201 with intake record", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("POST /api/intake (no token) returns 201 with intake record", False, str(e))

# Test 4.2: GET /api/intake (no token) should return 401
try:
    response = requests.get(f"{BASE_URL}/intake", timeout=10)
    if response.status_code == 401:
        log_test("GET /api/intake (no token) returns 401", True)
    else:
        log_test("GET /api/intake (no token) returns 401", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/intake (no token) returns 401", False, str(e))

# Test 4.3: GET /api/intake (valid token) should return 200 with list including new intake
try:
    response = requests.get(f"{BASE_URL}/intake", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if created_intake_id:
                found = any(item.get("id") == created_intake_id for item in data)
                if found:
                    log_test("GET /api/intake (valid token) returns 200 list including new intake", True)
                else:
                    log_test("GET /api/intake (valid token) returns 200 list including new intake", False, 
                            f"Created intake ID {created_intake_id} not found in list")
            else:
                log_test("GET /api/intake (valid token) returns 200 list including new intake", True)
        else:
            log_test("GET /api/intake (valid token) returns 200 list including new intake", False, 
                    f"Response is not a list: {type(data)}")
    else:
        log_test("GET /api/intake (valid token) returns 200 list including new intake", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/intake (valid token) returns 200 list including new intake", False, str(e))

# Test 4.4: Verify intake was mirrored to contact_messages
try:
    response = requests.get(f"{BASE_URL}/contact", headers=ADMIN_HEADERS, timeout=10)
    if response.status_code == 200:
        data = response.json()
        # Look for a contact message with subject starting with "Intake —"
        intake_mirror = [item for item in data if item.get("subject", "").startswith("Intake —")]
        if intake_mirror:
            # Check if the most recent one matches our intake
            latest = intake_mirror[0]
            if intake_payload["project_type"] in latest.get("subject", ""):
                log_test("Intake mirrored to contact_messages with subject 'Intake —'", True)
            else:
                log_test("Intake mirrored to contact_messages with subject 'Intake —'", False, 
                        f"Found intake mirror but project type mismatch. Subject: {latest.get('subject')}")
        else:
            log_test("Intake mirrored to contact_messages with subject 'Intake —'", False, 
                    "No contact messages with subject starting with 'Intake —' found")
    else:
        log_test("Intake mirrored to contact_messages with subject 'Intake —'", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Intake mirrored to contact_messages with subject 'Intake —'", False, str(e))

print()

# ============================================================================
# TEST 5: Other Public Endpoints
# ============================================================================
print("TEST SUITE 5: Other Public Endpoints (unchanged)")
print("-" * 80)

# Test 5.1: GET /api/ (root)
try:
    response = requests.get(f"{BASE_URL}/", timeout=10)
    if response.status_code == 200:
        data = response.json()
        if data.get("service") == "ATLAS VEX" and data.get("status") == "online":
            log_test("GET /api/ returns 200 {service:'ATLAS VEX', status:'online'}", True)
        else:
            log_test("GET /api/ returns 200 {service:'ATLAS VEX', status:'online'}", False, 
                    f"Unexpected response: {data}")
    else:
        log_test("GET /api/ returns 200 {service:'ATLAS VEX', status:'online'}", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/ returns 200 {service:'ATLAS VEX', status:'online'}", False, str(e))

# Test 5.2: GET /api/telemetry
try:
    response = requests.get(f"{BASE_URL}/telemetry", timeout=10)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list) and len(data) == 4:
            # Check if all items have label, value, unit
            valid = all("label" in item and "value" in item and "unit" in item for item in data)
            if valid:
                log_test("GET /api/telemetry returns 200 list of 4 TelemetryPoint dicts", True)
            else:
                log_test("GET /api/telemetry returns 200 list of 4 TelemetryPoint dicts", False, 
                        "Items missing required fields (label, value, unit)")
        else:
            log_test("GET /api/telemetry returns 200 list of 4 TelemetryPoint dicts", False, 
                    f"Expected list of 4 items, got {len(data) if isinstance(data, list) else type(data)}")
    else:
        log_test("GET /api/telemetry returns 200 list of 4 TelemetryPoint dicts", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/telemetry returns 200 list of 4 TelemetryPoint dicts", False, str(e))

# Test 5.3: GET /api/github/repos
try:
    response = requests.get(f"{BASE_URL}/github/repos", timeout=15)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            # May be empty if rate-limited, but should not 500
            log_test("GET /api/github/repos returns 200 list (may be empty if rate-limited)", True)
        else:
            log_test("GET /api/github/repos returns 200 list (may be empty if rate-limited)", False, 
                    f"Response is not a list: {type(data)}")
    else:
        log_test("GET /api/github/repos returns 200 list (may be empty if rate-limited)", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/github/repos returns 200 list (may be empty if rate-limited)", False, str(e))

# Test 5.4: POST /api/chat
chat_payload = {
    "session_id": f"test-chat-{uuid.uuid4().hex[:8]}",
    "message": "Hello Atlas Vex, can you tell me about Alan Marvel's expertise?"
}

try:
    response = requests.post(f"{BASE_URL}/chat", json=chat_payload, timeout=30)
    if response.status_code == 200:
        data = response.json()
        if "reply" in data and isinstance(data["reply"], str) and len(data["reply"]) > 0:
            log_test("POST /api/chat returns 200 with reply field", True)
        else:
            log_test("POST /api/chat returns 200 with reply field", False, 
                    f"Missing or empty reply field. Response: {data}")
    elif response.status_code == 503:
        # EMERGENT_LLM_KEY missing - but we have the key, so this is unexpected
        log_test("POST /api/chat returns 200 with reply field", False, 
                f"Got 503 (LLM key missing) but EMERGENT_LLM_KEY should be present")
    else:
        log_test("POST /api/chat returns 200 with reply field", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("POST /api/chat returns 200 with reply field", False, str(e))

# Test 5.5: GET /api/chat/history/{session_id}
try:
    response = requests.get(f"{BASE_URL}/chat/history/{chat_payload['session_id']}", timeout=10)
    if response.status_code == 200:
        data = response.json()
        if "messages" in data and isinstance(data["messages"], list):
            # Should have at least 2 messages (user + assistant)
            if len(data["messages"]) >= 2:
                log_test("GET /api/chat/history/{session_id} returns 200 with messages array", True)
            else:
                log_warning("GET /api/chat/history/{session_id}", 
                           f"Expected at least 2 messages, got {len(data['messages'])}")
                log_test("GET /api/chat/history/{session_id} returns 200 with messages array", True)
        else:
            log_test("GET /api/chat/history/{session_id} returns 200 with messages array", False, 
                    f"Missing or invalid messages field. Response: {data}")
    else:
        log_test("GET /api/chat/history/{session_id} returns 200 with messages array", False, 
                f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("GET /api/chat/history/{session_id} returns 200 with messages array", False, str(e))

print()

# ============================================================================
# TEST SUMMARY
# ============================================================================
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"✅ PASSED: {len(test_results['passed'])}")
print(f"❌ FAILED: {len(test_results['failed'])}")
print(f"⚠️  WARNINGS: {len(test_results['warnings'])}")
print()

if test_results['failed']:
    print("FAILED TESTS:")
    print("-" * 80)
    for failure in test_results['failed']:
        print(f"❌ {failure['name']}")
        if failure['details']:
            print(f"   {failure['details']}")
    print()

if test_results['warnings']:
    print("WARNINGS (non-critical):")
    print("-" * 80)
    for warning in test_results['warnings']:
        print(f"⚠️  {warning['name']}: {warning['details']}")
    print()

print("=" * 80)
if len(test_results['failed']) == 0:
    print("🎉 ALL CRITICAL TESTS PASSED!")
else:
    print(f"⚠️  {len(test_results['failed'])} CRITICAL TEST(S) FAILED")
print("=" * 80)
