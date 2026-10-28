
import html
import logging
import os
from urllib.parse import urlencode

import resend

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
MAIL_FROM = os.getenv("MAIL_FROM")
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
).rstrip("/")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured")

if not MAIL_FROM:
    raise RuntimeError("MAIL_FROM is not configured")

resend.api_key = RESEND_API_KEY


def _build_email_template(
    *,
    title: str,
    greeting: str,
    message: str,
    button_text: str,
    action_url: str,
    expiry_message: str,
    footer_message: str,
) -> str:
    """Build a branded Vakeel Vision HTML email."""

    safe_title = html.escape(title)
    safe_greeting = html.escape(greeting)
    safe_message = html.escape(message)
    safe_button_text = html.escape(button_text)
    safe_url = html.escape(action_url, quote=True)
    safe_expiry = html.escape(expiry_message)
    safe_footer = html.escape(footer_message)

    return f"""\
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>{safe_title}</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #F1F5F9;
    font-family: Arial, Helvetica, sans-serif;
    color: #1E293B;
">
    <div style="
        display: none;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
    ">
        {safe_title} — Vakeel Vision
    </div>

    <table role="presentation" width="100%" cellspacing="0"
           cellpadding="0" border="0"
           style="background-color: #F1F5F9;">
        <tr>
            <td align="center" style="padding: 36px 16px;">

                <table role="presentation" width="100%"
                       cellspacing="0" cellpadding="0" border="0"
                       style="
                           max-width: 560px;
                           background-color: #FFFFFF;
                           border: 1px solid #E2E8F0;
                           border-radius: 16px;
                           overflow: hidden;
                       ">

                    <!-- Brand header -->
                    <tr>
                        <td align="center" style="
                            background-color: #172554;
                            padding: 30px 24px;
                        ">
                            <div style="
                                display: inline-block;
                                background-color: #2563EB;
                                color: #FFFFFF;
                                font-size: 19px;
                                font-weight: bold;
                                padding: 10px 13px;
                                border-radius: 10px;
                                margin-bottom: 12px;
                            ">
                                VV
                            </div>

                            <div style="
                                color: #FFFFFF;
                                font-size: 24px;
                                font-weight: bold;
                                letter-spacing: -0.5px;
                            ">
                                Vakeel Vision
                            </div>

                            <div style="
                                color: #BFDBFE;
                                font-size: 13px;
                                margin-top: 8px;
                            ">
                                Your legal documents, made clearer.
                            </div>
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding: 36px 32px 28px;">

                            <h1 style="
                                margin: 0 0 18px;
                                color: #172554;
                                font-size: 25px;
                                line-height: 1.35;
                            ">
                                {safe_title}
                            </h1>

                            <p style="
                                margin: 0 0 14px;
                                color: #1E293B;
                                font-size: 16px;
                                line-height: 1.7;
                            ">
                                {safe_greeting}
                            </p>

                            <p style="
                                margin: 0 0 28px;
                                color: #64748B;
                                font-size: 15px;
                                line-height: 1.8;
                            ">
                                {safe_message}
                            </p>

                            <!-- Primary action button -->
                            <table role="presentation" width="100%"
                                   cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" bgcolor="#2563EB"
                                        style="border-radius: 9px;">
                                        <a href="{safe_url}" style="
                                            display: block;
                                            padding: 15px 20px;
                                            color: #FFFFFF;
                                            font-size: 15px;
                                            font-weight: bold;
                                            text-decoration: none;
                                            border-radius: 9px;
                                        ">
                                            {safe_button_text}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="
                                margin: 24px 0 8px;
                                color: #64748B;
                                font-size: 12px;
                                line-height: 1.7;
                            ">
                                If the button doesn't work, copy this link
                                into your browser:
                            </p>

                            <p style="
                                margin: 0 0 26px;
                                font-size: 12px;
                                line-height: 1.7;
                                word-break: break-all;
                            ">
                                <a href="{safe_url}" style="
                                    color: #2563EB;
                                    text-decoration: underline;
                                ">
                                    {safe_url}
                                </a>
                            </p>

                            <!-- Security notice -->
                            <table role="presentation" width="100%"
                                   cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="
                                        padding: 15px 16px;
                                        background-color: #EFF6FF;
                                        border-left: 4px solid #2563EB;
                                        border-radius: 4px;
                                        color: #172554;
                                        font-size: 13px;
                                        line-height: 1.7;
                                    ">
                                        <strong>Security notice</strong><br>
                                        {safe_expiry}
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            padding: 22px 32px;
                            background-color: #F8FAFC;
                            border-top: 1px solid #E2E8F0;
                        ">
                            <p style="
                                margin: 0 0 12px;
                                color: #64748B;
                                font-size: 12px;
                                line-height: 1.7;
                                text-align: center;
                            ">
                                {safe_footer}
                            </p>

                            <p style="
                                margin: 0;
                                color: #64748B;
                                font-size: 11px;
                                line-height: 1.7;
                                text-align: center;
                            ">
                                © Vakeel Vision · Secure legal document management
                            </p>
                        </td>
                    </tr>

                </table>

                <p style="
                    margin: 18px 0 0;
                    color: #64748B;
                    font-size: 11px;
                    text-align: center;
                ">
                    This is an automated message. Please do not reply.
                </p>

            </td>
        </tr>
    </table>
</body>
</html>
"""


async def _send_email(
    *,
    to_email: str,
    subject: str,
    html_content: str,
    email_type: str,
) -> None:
    """Send an email using Resend asynchronously."""

    params = {
        "from": MAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
    }

    try:
        await resend.Emails.send_async(params)
        logger.info("%s email sent to %s", email_type, to_email)

    except Exception:
        logger.exception(
            "Failed to send %s email to %s",
            email_type,
            to_email,
        )
        raise


async def send_verification_email(
    to_email: str,
    verification_token: str,
) -> None:
    """Send an email verification link asynchronously."""

    verification_url = (
        f"{FRONTEND_URL}/verify-email?"
        f"{urlencode({'token': verification_token})}"
    )

    html_content = _build_email_template(
        title="Verify your email address",
        greeting="Welcome to Vakeel Vision!",
        message=(
            "Thanks for creating your account. Verify your email address "
            "to activate your account and get started."
        ),
        button_text="Verify my email",
        action_url=verification_url,
        expiry_message=(
            "This verification link expires in 30 minutes. "
            "If it expires, request a new verification email."
        ),
        footer_message=(
            "If you did not create a Vakeel Vision account, "
            "you can safely ignore this email."
        ),
    )

    await _send_email(
        to_email=to_email,
        subject="Verify your email | Vakeel Vision",
        html_content=html_content,
        email_type="verification",
    )


async def send_reset_password_email(
    to_email: str,
    reset_token: str,
) -> None:
    """Send a password-reset link asynchronously."""

    reset_url = (
        f"{FRONTEND_URL}/reset-password?"
        f"{urlencode({'token': reset_token})}"
    )

    html_content = _build_email_template(
        title="Reset your password",
        greeting="Hello,",
        message=(
            "We received a request to reset your Vakeel Vision account "
            "password. Use the button below to choose a new password."
        ),
        button_text="Reset my password",
        action_url=reset_url,
        expiry_message=(
            "This link expires in 30 minutes and can only be used once. "
            "Request a new link if it expires."
        ),
        footer_message=(
            "If you did not request a password reset, you can ignore "
            "this email. Your password will not change unless the reset "
            "process is completed."
        ),
    )

    await _send_email(
        to_email=to_email,
        subject="Reset your password | Vakeel Vision",
        html_content=html_content,
        email_type="password reset",
    )
