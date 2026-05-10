"""
Email notification service for ATLAS VEX.
- Uses Resend (sync SDK) wrapped via asyncio.to_thread to stay non-blocking
- Designed for fire-and-forget via FastAPI BackgroundTasks
- Failures are logged but never raised — they must NOT break the API response
"""
import os
import html
import asyncio
import logging
from datetime import datetime
from typing import Optional

import resend

logger = logging.getLogger(__name__)

SENDER_NAME = "ATLAS VEX"


def _esc(value) -> str:
    """HTML-escape user-supplied values to prevent injection in email bodies."""
    if value is None:
        return ""
    return html.escape(str(value))


# ---------- Brand-coherent HTML email shell ----------
def _shell(title: str, badge_color: str, badge_label: str, body_html: str) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8" /><title>{_esc(title)}</title></head>
<body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#020617;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#0a0f1c;border:1px solid #18223a;border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:24px 28px;border-bottom:1px solid #18223a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left">
                <div style="font-family:Consolas,Menlo,monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#00E5FF;">
                  ATLAS.VEX // OPERATOR CHANNEL
                </div>
                <div style="font-size:22px;font-weight:700;color:#F8FAFC;margin-top:4px;letter-spacing:-0.5px;">
                  {_esc(title)}
                </div>
              </td>
              <td align="right">
                <span style="display:inline-block;padding:4px 10px;border:1px solid {badge_color};color:{badge_color};font-family:Consolas,Menlo,monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;border-radius:2px;">
                  {_esc(badge_label)}
                </span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px;">
          {body_html}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 28px;border-top:1px solid #18223a;">
          <div style="font-family:Consolas,Menlo,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#475569;">
            // Auto-routed via Atlas Vex notification mesh<br/>
            // Console: <a href="https://themarvel.space/admin" style="color:#00E5FF;text-decoration:none;">/admin</a>
            &nbsp;·&nbsp; Timestamp: {_esc(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"))}
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def _kv_row(label: str, value: str, accent: str = "#00E5FF") -> str:
    return f"""
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #18223a;vertical-align:top;width:140px;">
        <div style="font-family:Consolas,Menlo,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:{accent};">
          {_esc(label)}
        </div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #18223a;vertical-align:top;color:#F8FAFC;font-size:14px;line-height:1.5;">
        {value}
      </td>
    </tr>"""


# ---------- Internal: send via Resend ----------
async def _send_async(subject: str, html_body: str, to_email: Optional[str] = None) -> Optional[str]:
    """
    Returns the Resend email id on success, None on failure.
    Never raises — fire-and-forget safe.
    Reads env vars at call-time so it works regardless of import order.
    """
    api_key = os.environ.get("RESEND_API_KEY", "")
    sender_email = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    notify_email = os.environ.get("NOTIFY_EMAIL", "")

    if not api_key:
        logger.warning("RESEND_API_KEY not configured — skipping email notification")
        return None
    recipient = to_email or notify_email
    if not recipient:
        logger.warning("NOTIFY_EMAIL not configured — skipping email notification")
        return None

    # Configure SDK at call-time (idempotent)
    resend.api_key = api_key

    params = {
        "from": f"{SENDER_NAME} <{sender_email}>",
        "to": [recipient],
        "subject": subject,
        "html": html_body,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else None
        logger.info(f"[email] sent → {recipient} subject='{subject[:60]}' id={email_id}")
        return email_id
    except Exception as e:  # noqa: BLE001 — log and swallow
        logger.error(f"[email] FAILED → {recipient} subject='{subject[:60]}' err={e}")
        return None


# ---------- Public: notification builders ----------
async def notify_new_contact(record: dict) -> Optional[str]:
    name = _esc(record.get("name", "Unknown"))
    email = _esc(record.get("email", ""))
    subject_field = _esc(record.get("subject") or "—")
    message = _esc(record.get("message", "")).replace("\n", "<br/>")

    rows = (
        _kv_row("Name", f'<strong style="color:#F8FAFC;">{name}</strong>')
        + _kv_row(
            "Email",
            f'<a href="mailto:{email}" style="color:#00E5FF;text-decoration:none;">{email}</a>',
            "#39FF14",
        )
        + _kv_row("Subject", subject_field, "#FFB000")
        + _kv_row(
            "Message",
            f'<div style="white-space:pre-wrap;line-height:1.6;">{message}</div>',
            "#00E5FF",
        )
    )
    body = f"""
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
          A new transmission has arrived through the contact channel.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}</table>
        <div style="margin-top:24px;">
          <a href="mailto:{email}" style="display:inline-block;padding:10px 18px;background:#00E5FF;color:#020617;text-decoration:none;font-family:Consolas,Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-radius:2px;">Reply to {name}</a>
        </div>
    """
    return await _send_async(
        subject=f"[ATLAS.VEX] New contact — {record.get('name','Unknown')}",
        html_body=_shell("New Contact Transmission", "#00E5FF", "INBOUND", body),
    )


async def notify_new_intake(record: dict) -> Optional[str]:
    name = _esc(record.get("name") or "Anonymous lead")
    email = _esc(record.get("email") or "")
    project_type = _esc(record.get("project_type", "—"))
    timeline = _esc(record.get("timeline", "—"))
    budget = _esc(record.get("budget", "—"))
    notes = _esc(record.get("notes") or "—").replace("\n", "<br/>")
    session_id = _esc(record.get("session_id", ""))

    email_html = (
        f'<a href="mailto:{email}" style="color:#00E5FF;text-decoration:none;">{email}</a>'
        if email
        else '<span style="color:#475569;font-style:italic;">— not provided —</span>'
    )

    rows = (
        _kv_row("Lead", f'<strong style="color:#F8FAFC;">{name}</strong>')
        + _kv_row("Email", email_html, "#39FF14")
        + _kv_row("Project Type", f'<span style="color:#00E5FF;">{project_type}</span>', "#00E5FF")
        + _kv_row("Timeline", f'<span style="color:#FFB000;">{timeline}</span>', "#FFB000")
        + _kv_row("Budget", f'<span style="color:#39FF14;">{budget}</span>', "#39FF14")
        + _kv_row("Notes", f'<div style="white-space:pre-wrap;line-height:1.6;">{notes}</div>')
        + _kv_row(
            "Session",
            f'<code style="color:#475569;font-size:11px;">{session_id}</code>',
            "#475569",
        )
    )
    body = f"""
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
          A new engagement intake has been submitted. Lead-qualification fields are below.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}</table>
        <div style="margin-top:24px;">
          <a href="https://themarvel.space/admin" style="display:inline-block;padding:10px 18px;background:#FFB000;color:#020617;text-decoration:none;font-family:Consolas,Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-radius:2px;">Open Admin Console</a>
        </div>
    """
    return await _send_async(
        subject=f"[ATLAS.VEX] New intake — {project_type} · {timeline}",
        html_body=_shell("New Engagement Intake", "#FFB000", "QUALIFIED", body),
    )


async def notify_new_subscriber(record: dict) -> Optional[str]:
    email = _esc(record.get("email", ""))
    source = _esc(record.get("source") or "—")

    rows = (
        _kv_row(
            "Email",
            f'<a href="mailto:{email}" style="color:#00E5FF;text-decoration:none;font-weight:600;">{email}</a>',
            "#00E5FF",
        )
        + _kv_row("Source", source, "#39FF14")
    )
    body = f"""
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
          A new node has joined the ATLAS VEX broadcast frequency.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}</table>
    """
    return await _send_async(
        subject=f"[ATLAS.VEX] New subscriber — {record.get('email','')}",
        html_body=_shell("New Newsletter Subscriber", "#39FF14", "SUBSCRIBED", body),
    )
