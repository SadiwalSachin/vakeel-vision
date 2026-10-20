from datetime import datetime, timezone
from sqlmodel import Session
from app.models.documet_content import DocumentContent

def save_extracted_content(
    session:Session,
    document_id:int,
    extracted_text:str,
    page_count:int | None
)-> DocumentContent:
    """Persist extracted text and its metadata."""
    
    now = datetime.now(timezone.utc)
    
    content = DocumentContent(
        document_id=document_id,
        extracted_text=extracted_text,
        character_count=len(extracted_text),
        page_count=page_count,
        extraction_completed=True,
        created_at=now,
        updated_at=now
    )
    
    session.add(content)
    session.flush()
    
    return content