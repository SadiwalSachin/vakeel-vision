from datetime import datetime, timezone

from sqlmodel import SQLModel, Field
from sqlalchemy import UniqueConstraint, Index, text


class AuthIdentity(SQLModel, table=True):
    # Explicitly sets the database table name.
    __tablename__ = "auth_identity"

    # Primary key; the database generates the ID for new records.
    id: int | None = Field(default=None, primary_key=True)

    # Links this authentication identity to its owner in the User table.
    user_id: int = Field(foreign_key="user.id", index=True)

    # Identifies the login method, such as "password" or "google".
    provider: str = Field(max_length=30, nullable=False)

    # Stores the stable user ID from an external provider, such as Google.
    # Password-based identities can leave this field empty.
    provider_user_id: str | None = Field(
        default=None,
        max_length=255,
    )

    # Stores a secure password hash, never the original password.
    # Google-only identities do not need a local password hash.
    password_hash: str | None = Field(
        default=None,
        max_length=255,
    )

    # Records when this authentication identity was created in UTC.
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        # Prevents the same external account from being registered
        # more than once for the same provider.
        UniqueConstraint(
            "provider",
            "provider_user_id",
            name="uq_auth_identity_provider_user",
        ),

        # Allows at most one password identity per user.
        # This partial unique index applies only to password identities.
        Index(
            "uq_auth_identity_password_user",
            "user_id",
            unique=True,
            postgresql_where=text("provider = 'password'"),
        ),
    )
