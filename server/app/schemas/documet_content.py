
from datetime import datetime

from sqlmodel import SQLModel


class DocumentContentRead(SQLModel):
    """Extracted document content returned by the API."""

    id: int
    document_id: int
    extracted_text: str | None
    character_count: int
    page_count: int | None
    extraction_completed: bool
    created_at: datetime
    updated_at: datetime
