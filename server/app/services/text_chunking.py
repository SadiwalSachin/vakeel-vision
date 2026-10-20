from langchain_text_splitters import RecursiveCharacterTextSplitter
from dataclasses import dataclass

def chunk_document_text(
    text:str,
    chunk_size:int = 4000,
    chunk_overlap:int = 400
) -> list[str]:
    """
    Split document text into overlapping chunks.

    Args:
        text: Normalized document text.
        chunk_size: Maximum target size of each chunk, in characters.
        chunk_overlap: Target overlap between consecutive chunks.

    Returns:
        A list of text chunks.
    """
    
    if chunk_size < 0:
        raise ValueError("chunk_size must be greater than zero.")   

    if chunk_overlap < 0:
        raise ValueError("chunk_overlap cannot be negative.")

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size.")
    
    if not text or not text.strip():
        return []
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function = len,
        separators=["\n\n","\n",". ",", ",""," "],
        keep_separator=True
    )
    
    return splitter.split_text(text=text)




@dataclass(frozen=True)
class PageAwareChunk:
    """A text chunk linked to its original PDF page."""
    chunk_index: int
    page_number: int
    text: str


def chunk_document_pages(
    pages: list[str],
    chunk_size: int = 4000,
    chunk_overlap: int = 400,
) -> list[PageAwareChunk]:
    """
    Split PDF pages into chunks while preserving page references.

    Page numbers are 1-based, matching normal PDF page numbering.
    Chunks never cross page boundaries.
    """
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if chunk_overlap < 0:
        raise ValueError("chunk_overlap cannot be negative.")

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size.")

    chunks: list[PageAwareChunk] = []

    for page_number, page_text in enumerate(pages, start=1):
        page_chunks = chunk_document_text(
            page_text,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        for chunk_text in page_chunks:
            chunks.append(
                PageAwareChunk(
                    chunk_index=len(chunks),
                    page_number=page_number,
                    text=chunk_text,
                )
            )

    return chunks
