from sqlmodel import Session, select
from app.models import DocumentChunk, ChunkEmbedding


def retrieve_relavant_chunk(
    session:Session,
    document_id:int,
    query_embedding:list[float],
    limit:int =5,
) -> list[dict]:
    """Retrieve the closest embedded chunks from one document."""
    
    distance = ChunkEmbedding.embedding.cosine_distance(
        query_embedding
    )
    
    statement = (
        select(DocumentChunk,distance.label("distance"))
        .join(
            ChunkEmbedding,
            ChunkEmbedding.chunk_id == DocumentChunk.id
        )
        .where(DocumentChunk.document_id == document_id)
        .order_by(distance)
        .limit(limit)
    )
    
    rows = session.exec(statement=statement).all()
    
    return [
        {
            "chunk":chunk,
            "distance":float(distance_value)
        }
        for chunk , distance_value in rows
    ]