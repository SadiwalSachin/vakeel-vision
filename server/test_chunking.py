
from app.services.text_chunking import chunk_document_text


sample_text = """
SERVICE AGREEMENT

1. PAYMENT
The Client shall pay all invoices within 30 days of receipt.

2. TERMINATION
Either party may terminate this agreement by providing
30 days written notice to the other party.

3. CONFIDENTIALITY
Both parties shall protect confidential information
received during the term of this agreement.
"""

chunks = chunk_document_text(
    sample_text,
    chunk_size=150,
    chunk_overlap=30,
)

print(f"Total chunks: {len(chunks)}")

for index, chunk in enumerate(chunks, start=1):
    print(f"\n--- Chunk {index} ({len(chunk)} characters) ---")
    print(chunk)
