from sqlmodel import SQLModel, Field
from typing import Literal, Optional
from datetime import datetime

class DocumentCreate(SQLModel):
    """Fields a client may provide when creating a document record."""

    filename:str | None = Field(default=None,max_length=255)
    source_type:Literal["pdf","text"] = "text"
    
class DocumentUpdate(SQLModel):
    
    """Fields a client may update on an existing document."""
    
    filename:str | None = Field(default=None,max_length=255)
    
class DocumentRead(SQLModel):
    """Fields returned to the client."""
    id: int
    filename: str | None = None
    source_type: str = "text"
    content_type: str | None = None
    file_size_bytes: int | None = None
    status: str = "pending"  # or whatever your default status is
    summary: str | None = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
class DocumentTextCreate(SQLModel):
    """Request body for submitting plain-text documents."""
    
    filename:str = Field(
        min_length=1,
        max_length=255,
        description="A name for the text document.",
    )
    
    text:str = Field(
        min_length=1,
        max_length=500_000,
        description="The legal document text to store and analyze.",
    )
    
    