from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class DocumentChunk(SQLModel,table=True):
    """Store a document chunk and its original source location."""
    
    id:int | None = Field(default=None,primary_key=True)
    
    document_id: int = Field(foreign_key="document.id",index=True)
    
    chunk_index:int = Field(min_length=0,description="Zero-based position within the document.")
    
    text:str = Field(min_length=1,description="Extracted text used for analysis and retrieval.")
    
    page_number:int | None = Field(
        default=None,
        ge=1,
        description="One-based PDF page number.",
    )
    
    start_index: int | None = Field(
        default=None,
        ge=0,
        description="Character offset within the source page, if available.",
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )