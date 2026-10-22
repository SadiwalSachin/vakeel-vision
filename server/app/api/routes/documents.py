from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlmodel import Session, select

from app.db.dependencies import get_session
from app.models import Document
from app.models.chunk_embedding import ChunkEmbedding
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate, DocumentTextCreate, AskDocumentRequest

from pathlib import Path
from app.services.document_storage import (UPLOAD_DIR,save_upload_file,delete_uploaded_file)

from app.services.document_content import save_extracted_content
from app.services.document_processing import extract_stored_pdf
from app.services.text_preprocessing import normalize_document_text
from app.services.document_processing import prepare_stored_pdf_chunks
from app.services.embedding_service import generate_document_embedding
from app.services.embedding_service import generate_query_embedding
from app.services.retrieval_service import retrieve_relavant_chunk
from app.services.analysis_service import generate_answer

from app.models.documet_content import DocumentContent
from app.models.document_chunk import DocumentChunk
from app.schemas.documet_content import DocumentContentRead

router = APIRouter(prefix="/documents", tags=["Documents"])

# Create a new document
@router.post(
    "/",
    response_model=DocumentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_document(
    document_data: DocumentCreate,
    session: Session = Depends(get_session),
):
    document = Document(
        filename=document_data.filename,
        source_type=document_data.source_type,
        status="uploaded",
    )

    session.add(document)
    session.commit()
    session.refresh(document)

    return document


# List all documents
@router.get("/", response_model=list[DocumentRead])
def list_documents(
    session: Session = Depends(get_session),
):
    statement = select(Document).order_by(Document.created_at.desc())
    return session.exec(statement).all()


@router.get("/{document_id}", response_model=DocumentRead)
def get_document(
    document_id: int,
    session: Session = Depends(get_session),
):
    document = session.get(Document, document_id)

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    return document


@router.patch("/{document_id}", response_model=DocumentRead)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    session: Session = Depends(get_session),
):
    document = session.get(Document, document_id)

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    update_data = document_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)

    session.add(document)
    session.commit()
    session.refresh(document)

    return document


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_document(
    document_id: int,
    session: Session = Depends(get_session),
):
    document = session.get(Document, document_id)

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
        
    storage_key = document.storage_key
    file_path = UPLOAD_DIR / storage_key if storage_key else None
        
    try:
        # 1. Find extracted content linked to this document.
        statement = select(DocumentContent).where(
            DocumentContent.document_id == document_id
        )
        
        # 2. Delete the child record first to satisfy the foreign key.
        content = session.exec(statement=statement).first()
        
        if content is not None:
            session.delete(content)
            
            session.flush()
        
        # 3. Delete the parent document.   
        session.delete(document)
        
        # 4. Persist both deletions together.
        session.commit()
        
        if storage_key is not None:
            delete_uploaded_file(storage_key=storage_key)
    
    except Exception:
        session.rollback()
        raise
        
        
    

@router.post("/upload",response_model=DocumentRead,status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file:UploadFile = File(...),
    session:Session=Depends(get_session)
):
    # Check the original filename before saving.
    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(
           status_code=status.HTTP_400_BAD_REQUEST,
           detail="Only PDF files are accepted.", 
        )
        
    storage_key = None
    
    try:
        # Save the file using the size-limited storage service.
        # 1. Save the uploaded file to persistent local storage.
        storage_key , file_size = await save_upload_file(file)
        
        # 2. Extract text before creating database records.
        
        extract_text, page_count = extract_stored_pdf(storage_key=storage_key)
        chunks = prepare_stored_pdf_chunks(storage_key=storage_key)
        
        # Reject PDFs that contain no extractable text for now.
        
        if not extract_text.strip():
            raise HTTPException(
             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "No selectable text was found. "
                    "The PDF may be scanned or image-based."
                ),   
            )
            
        # 3. Stage the document metadata.
        # Create the corresponding database record.
        document = Document(
            filename=Path(file.filename).name,
            source_type="pdf",
            content_type=file.content_type,
            file_size_bytes=file_size,
            storage_key=storage_key,
            status="uploaded"
        )
        
        session.add(document)
        session.flush()
        
        # 4. Stage extracted content linked to the document.
        save_extracted_content(
            session=session,
            document_id=document.id,
            extracted_text=extract_text,
            page_count=page_count
        )
        
        chunk_records = [
            DocumentChunk(
                document_id=document.id,
                chunk_index=index,
                text=chunk.page_content,
                page_number=(
                    chunk.metadata["page"] + 1
                    if isinstance(chunk.metadata.get("page"),int)
                    else None
                ),
                start_index=chunk.metadata.get("start_index")
            ) for index,chunk in enumerate(chunks)
        ]
        
        session.add_all(chunk_records)
        session.flush()
        
        embedding_records = []
        
        for chunk_record in chunk_records:
            embedding = generate_document_embedding(chunk_record.text)
            
            embedding_records.append(
                ChunkEmbedding(
                    chunk_id=chunk_record.id,
                    model_name="gemini-embedding-2",
                    model_version="1536",
                    embedding=embedding
                )
            )
            
        session.add_all(embedding_records)
        
        session.commit()
        session.refresh(document)
        
        return document
    
    except Exception:
        session.rollback()
        
        # Avoid leaving an orphaned file if database persistence fails.
        if storage_key:
            delete_uploaded_file(storage_key=storage_key)
        raise
    
    except ValueError as exc:
        session.rollback()
        
        if storage_key:
            delete_uploaded_file(storage_key=storage_key)
            
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
        
    except Exception:
        session.rollback()
        if storage_key:
            delete_uploaded_file(storage_key=storage_key)
        raise


@router.get("/{document_id}/content",response_model=DocumentContentRead)
def get_document_conent(
    document_id:int,
    session:Session=Depends(get_session)
):
    # Confirm that the parent document exists.
    
    document = session.get(Document,document_id)
    
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found", 
        )
    
    # Retrieve the extracted text associated with this document.
    statement = select(DocumentContent).where(
        DocumentContent.document_id == document_id
    )
    
    content = session.exec(statement=statement).first()
    
    if content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extracted content not found for this document",
        )
    
    return content


@router.post("/text",response_model=DocumentRead,status_code=status.HTTP_201_CREATED)
def create_text_document(
    document_data:DocumentTextCreate,
    session:Session=Depends(get_session)
):
    file_name = document_data.filename.strip()
    extracted_text = normalize_document_text(document_data.text)
        
    
    if not file_name or not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Filename and document text cannot be blank.",
        )
    
        
    document = Document(
        filename=file_name,
        source_type="text",
        content_type="text/plain",
        file_size_bytes=len(extracted_text.encode("utf-8")),
        status="processed"
    )
    
    try:
        session.add(document)
        session.flush()
        
        save_extracted_content(
            session=session,
            document_id=document.id,
            extracted_text=extracted_text,
            page_count=None
        )
        
        session.commit()
        session.refresh(document)
        
        return document
    
    except Exception:
        session.rollback()
        raise
    
    
@router.post("/{document_id}/ask")
def ask_document(
    document_id:int,
    payload:AskDocumentRequest,
    session:Session = Depends(get_session)
):
    # 1. Verify the document exist.
    
    document = session.get(Document,document_id)
    
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )
        
    # 2. Emebed the user's question
    
    query_embeddings = generate_query_embedding(payload.question)
    
    # 3. Retrieve the most relavent chunks from this document
    
    retrieved_chunks = retrieve_relavant_chunk(
        session=session,
        document_id=document_id,
        query_embedding=query_embeddings,
        limit=payload.top_k
    )
    
    if not retrieved_chunks:
        raise HTTPException(
            status_code=422,
            detail=(
                "No embedded chunks were found for this document. "
                "Ensure the document has been processed and indexed."
            ),
        )
        
    # 4. Generate an answer grounded in retrieved evidence.
    
    answer = generate_answer(
        question=payload.question,
        retrieved_chunks=retrieved_chunks
    )
    
 # 5. Return the answer with traceable source references.
    sources = []

    for index, result in enumerate(retrieved_chunks, start=1):
        chunk = result["chunk"]

        sources.append({
            "label": f"Source {index}",
            "chunk_id": chunk.id,
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number,
            "distance": result["distance"],
            "text": chunk.text,
        })

    return {
        "document_id": document_id,
        "question": payload.question,
        "answer": answer,
        "sources": sources,
    }
    
    
@router.post("/{document_id}/embeddings")
def get_embeddings(
    document_id:int,
    payload:AskDocumentRequest,
    session:Session=Depends(get_session)
):
# 1. Verify the document exist.
    
    document = session.get(Document,document_id)
    
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )
        
    # 2. Emebed the user's question
    
    query_embeddings = generate_query_embedding(payload.question)
    
    # 3. Retrieve the most relavent chunks from this document
    
    retrieved_chunks = retrieve_relavant_chunk(
        session=session,
        document_id=document_id,
        query_embedding=query_embeddings,
        limit=payload.top_k
    )
    
    if not retrieved_chunks:
        raise HTTPException(
            status_code=422,
            detail=(
                "No embedded chunks were found for this document. "
                "Ensure the document has been processed and indexed."
            ),
        )
        
    
 # 5. Return the answer with traceable source references.
    sources = []

    for index, result in enumerate(retrieved_chunks, start=1):
        chunk = result["chunk"]

        sources.append({
            "label": f"Source {index}",
            "chunk_id": chunk.id,
            "chunk_index": chunk.chunk_index,
            "page_number": chunk.page_number,
            "distance": result["distance"],
            "text": chunk.text,
        })

    return {
        "document_id": document_id,
        "question": payload.question,
        "sources": sources,
    }

    