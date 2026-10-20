from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.services.text_preprocessing import normalize_document_text

def load_and_chunk_pdf(
    file_path:Path,
    chunk_size:int = 4000,
    chunk_overlap:int = 400
) -> list[Document]:
    """Load a PDF and split it into chunks while preserving page metadata."""
    
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if chunk_overlap < 0 or chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be non-negative and smaller than chunk_size."
        )
        
    pages = PyPDFLoader(str(file_path)).load()
    
    normalized_pages = [
        Document(
            page_content=normalize_document_text(page.page_content),
            metadata=page.metadata
        ) for page in pages
        
        if page.page_content.strip()
    ]
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        add_start_index=True
    )
    
    return splitter.split_documents(normalized_pages)