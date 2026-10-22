from pathlib import Path

from pypdf import PdfReader
from pypdf.errors import PdfReadError

# This service is responsible for extracting text from PDF files, either as a whole or page by page, while handling errors and edge cases.
def extract_pdf_pages(file_path: Path) -> list[str]:
    """Extract selectable text separately from each PDF page."""
    try:
        reader = PdfReader(str(file_path), strict=False)

        if reader.is_encrypted:
            raise ValueError("Encrypted PDFs are not supported yet.")

        if len(reader.pages) == 0:
            raise ValueError("The PDF contains no pages.")

        return [
            page.extract_text() or ""
            for page in reader.pages
        ]

    except PdfReadError as exc:
        raise ValueError(
            "The uploaded file is not a readable PDF."
        ) from exc


def extract_pdf_text(file_path: Path) -> tuple[str, int]:
    """Extract combined text and page count from a PDF."""
    pages = extract_pdf_pages(file_path)

    extracted_text = "\n\n".join(pages).strip()

    return extracted_text, len(pages)
