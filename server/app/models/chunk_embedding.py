from datetime import datetime, timezone

from pgvector.sqlalchemy import VECTOR
from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field

class ChunkEmbedding(SQLModel,table=True):
    __tablename__ = "chunk_embedding"
    
    __table_args__ = (
        UniqueConstraint(
            "chunk_id",
            "model_name",
            "model_version",
            name="uq_chunk_embedding_model_version"
        ),
    )
    
    id: int | None = Field(default=None,primary_key=True)
    
    chunk_id: int = Field(foreign_key="documentchunk.id",index=True)
    
    model_name:str
    
    model_version:str
    
    embedding: list[float] = Field(
        sa_type=VECTOR(1536)
    )
    
    created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))