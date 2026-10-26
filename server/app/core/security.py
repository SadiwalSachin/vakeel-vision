import os
from datetime import datetime, timezone, timedelta
from pwdlib import PasswordHash
import secrets
import hashlib
import jwt
from typing import Any
from jwt import InvalidTokenError

password_hash = PasswordHash.recommended()

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def generate_verification_token() -> str:
    # Generate a cryptographically secure, URL-safe token
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    # Convert the token to bytes, then calculate its SHA-256 hash
    token_bytes = token.encode("utf-8")
    return hashlib.sha256(token_bytes).hexdigest()


def create_access_token(user_id: int) -> str:
    # Fail safely if the signing secret is missing
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not configured.")

    now = datetime.now(timezone.utc)

    # Keep the payload minimal
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }

    # Sign the token so the backend can verify its integrity
    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    # Fail safely if the JWT secret is missing
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not configured.")

    # Verify the signature and expiration time
    payload = jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
        options={"require": ["sub", "exp", "iat"]},
    )

    # Accept only access tokens, not refresh tokens
    if payload.get("type") != "access":
        raise InvalidTokenError("Invalid token type.")

    # Ensure the subject is a valid user ID
    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject.isdigit():
        raise InvalidTokenError("Invalid token subject.")

    return payload


def generate_refresh_token() -> str:
    # Generate a cryptographically random refresh token
    return secrets.token_urlsafe(48)


def create_refresh_token_hash(token: str) -> str:
    # Store only the SHA-256 hash in PostgreSQL
    return hash_token(token)
