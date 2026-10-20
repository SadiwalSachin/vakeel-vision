import re

def normalize_document_text(text: str) -> str:
    """
    Normalize extracted document text while preserving paragraphs.
    """
    # Normalize Windows and old-style line endings.
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Replace tabs and repeated spaces within lines.
    text = re.sub(r"[^\S\n]+", " ", text)

    # Remove spaces at the beginning and end of each line.
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)

    # Limit excessive blank lines to a single paragraph break.
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()
