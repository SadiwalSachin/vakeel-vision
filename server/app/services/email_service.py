
import html
import logging
import os

import resend

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
MAIL_FROM = os.getenv("MAIL_FROM")
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured")

if not MAIL_FROM:
    raise RuntimeError("MAIL_FROM is not configured")

resend.api_key = RESEND_API_KEY


async def send_verification_email(
    to_email: str,
    verification_token: str,
) -> None:
    """Send an email verification link asynchronously."""

    verification_url = (
        f"{FRONTEND_URL.rstrip('/')}/verify-email"
        f"?token={verification_token}"
    )

    safe_url = html.escape(verification_url, quote=True)

    params = {
        "from": MAIL_FROM,
        "to": [to_email],
        "subject": "Verify your Vakeel Vision email",
        "html": f"""
            <div>
                <h2>Welcome to Vakeel Vision</h2>
                <p>Please verify your email address to activate your account.</p>
                <p>
                    <a href="{safe_url}">Verify my email</a>
                </p>
                <p>This link expires in 30 minutes.</p>
                <p>If you did not create this account, you can ignore this email.</p>
            </div>
        """,
    }

    try:
        await resend.Emails.send_async(params)
        logger.info("Verification email sent to %s", to_email)
    except Exception:
        logger.exception(
            "Failed to send verification email to %s",
            to_email,
        )
        raise



async def send_reset_password_email(
    to_email: str,
    reset_token: str,
) -> None:
    """Send a password-reset link asynchronously."""

    reset_url = (
        f"{FRONTEND_URL.rstrip('/')}/reset-password"
        f"?token={reset_token}"
    )

    safe_url = html.escape(reset_url, quote=True)

    params = {
        "from": MAIL_FROM,
        "to": [to_email],
        "subject": "Reset your Vakeel Vision password",
        "html": f"""
            <div>
                <h2>Password reset request</h2>
                <p>
                    We received a request to reset your Vakeel Vision
                    account password.
                </p>
                <p>
                    <a href="{safe_url}">Reset my password</a>
                </p>
                <p>This link expires in 30 minutes and can only be used once.</p>
                <p>
                    If you did not request this, you can ignore this email.
                </p>
            </div>
        """,
    }

    try:
        await resend.Emails.send_async(params)
        logger.info("Password-reset email sent to %s", to_email)
    except Exception:
        logger.exception(
            "Failed to send password-reset email to %s",
            to_email,
        )
        raise
