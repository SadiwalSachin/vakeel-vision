from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

# This class is created for the table
class Document(SQLModel,table=True):
    # Here we will get the specifc id of the document which we will upload
    id:int | None = Field(default=None,primary_key=True)
    
    user_id:int = Field(foreign_key="user.id",index=True,nullable=False)
    
    # This is the filename we will analyze
    filename:str = Field(index=True, max_length=255)
    
    # Is that was pdf of simply text
    source_type:str | None = Field(default="pdf", max_length=20, index=True)
    
    # text/plan text/pdf
    content_type:str | None = Field(default=None , max_length=100)
    
    # file size
    file_size_bytes:int | None = Field(default=None,ge=0)
    
    storage_key:str | None = Field(default=None , max_length=500)
    
    # Status of uploaded and all
    status: str = Field(default="uploaded",max_length=50,index=True)
    
    # if we got any extraction error
    extraction_error:str | None = Field(default=None,max_length=1000)
    
    created_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    
    updated_at:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    
    