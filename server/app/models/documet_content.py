from sqlmodel import SQLModel, Field
from datetime import datetime, timezone


class DocumentContent(SQLModel,table=True):
    # Id for the conetnt 
    id:int | None = Field(default=None,primary_key=True)
    
    # here we are connecting the document content with the document through a doument id whihc will be a foriegn key
    document_id:int = Field(
        foreign_key="document.id",
        index=True,
        unique=True
    )
    
    # it will store extracted text
    extracted_text:str | None = Field(default=None)
    
    # it will store character count
    character_count:int = Field(default=0,ge=0)
    
    # it will store page count
    page_count:int | None = Field(default=None,ge=0)
    
    # this is for completion of extraction because this will be a background job
    extraction_completed:bool =Field(default=False)
    
    created_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    
    updated_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    
    