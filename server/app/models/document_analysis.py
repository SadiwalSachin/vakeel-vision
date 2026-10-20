from datetime import datetime, timezone
from sqlmodel import SQLModel,Field

class DocumentAnalysis(SQLModel,table=True):
    id:int | None = Field(default=None,primary_key=True)
    
    document_id:int = Field(
        foreign_key="document.id",
        index=True
    )
    
    status:str = Field(
        default="pending",
        max_length=50,
        index=True
    )
    
    summary:str | None = Field(
        default=None
    )
    
    risk_level:str | None = Field(default=None)
    
    provider:str | None = Field(default=None)
    model_name:str | None = Field(default=None)
    
    error_message:str | None = Field(default=None,max_length=500)
    
    created_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    updated_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    