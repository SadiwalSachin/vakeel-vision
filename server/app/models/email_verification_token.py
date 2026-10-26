from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class EmailVerificationToken(SQLModel,table=True):
    id:int | None = Field(primary_key=True,default=None)
    
    user_id: int = Field(foreign_key="user.id",index=True,nullable=False)
    
    token_hash: str = Field(
        max_length=255,
        unique=True,
        index=True,
        nullable=False
    )
    
    expires_at : datetime = Field(nullable=False)
    
    used_at: datetime | None = Field(
        default=None,
        nullable=True
    )
        
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc),nullable=False)