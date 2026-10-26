from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class PasswordResetToken(SQLModel, table=True):
    # Primary key generated automatically by the database.
    id: int | None = Field(
        default=None,
        primary_key=True,
    )

    # Associates this reset token with its user.
    user_id: int = Field(
        foreign_key="user.id",
        index=True,
        nullable=False,
    )

    # Store only the hash of the reset token, never the raw token.
    # A unique constraint prevents duplicate token hashes.
    token_hash: str = Field(
        max_length=255,
        unique=True,
        nullable=False,
    )

    # Expiration time supplied by the password-reset service.
    expires_at: datetime = Field(nullable=False)

    # None means the token has not been used.
    used_at: datetime | None = Field(
        default=None,
        nullable=True,
    )

    # Automatically records when the token is created, in UTC.
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
