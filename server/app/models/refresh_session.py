from sqlmodel import SQLModel,Field
from datetime import datetime,timezone


class RefreshSession(SQLModel,table=True):
    id: int | None = Field(primary_key=True,default=None,nullable=False)
    
    user_id: int = Field(
        foreign_key="user.id",
        index=True,
        nullable=False
    )
    
    token_hash: str = Field(
        unique=True,
        max_length=255,
        nullable=False
    )
    
    expires_at: datetime = Field(nullable=False)
    
    revoked_at: datetime | None = Field(
        default=None,
        nullable=True
    )
    
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc),nullable=False)
    