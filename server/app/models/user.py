from sqlmodel import SQLModel, Field
from datetime import datetime,timezone

class User(SQLModel,table=True):
    id: int | None = Field(default=None,primary_key=True)
    
    name: str = Field(max_length=100)
    
    email: str = Field(index=True,unique=True)
    
    is_email_verified: bool = Field(default=False)
    
    is_active: bool = Field(default=True)
    
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    
    updated_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))