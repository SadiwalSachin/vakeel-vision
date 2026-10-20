from app.services.pdf_extraction import extract_pdf_text
from app.services.text_preprocessing import normalize_document_text
from app.services.text_chunking import chunk_document_text

from langchain_core.documents import Document

from app.services.document_storage import get_uploaded_file_path
from app.services.langchain_pdf_processing import load_and_chunk_pdf

def extract_stored_pdf(storage_key:str) -> tuple[str,int]:
    """Extract text from a PDF identified by its storage key."""
    
    file_path = get_uploaded_file_path(storage_key=storage_key)
    
    extract_text, page_count = extract_pdf_text(file_path=file_path)
    
    normalized_text = normalize_document_text(extract_text)
    
    return normalized_text, page_count

def prepare_document_chunks(storage_key:str, chunk_size:int = 4000, chunk_overlap:int = 400) -> list[str]:
    """Extract text from a PDF and split it into overlapping chunks."""
    
    document_text, _ = extract_stored_pdf(storage_key=storage_key)
    
    return chunk_document_text(
        text=document_text,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    
def prepare_stored_pdf_chunks(storage_key: str) -> list[Document]:
    """Prepare page-aware LangChain chunks from a stored PDF."""
    file_path = get_uploaded_file_path(storage_key)
    return load_and_chunk_pdf(file_path)