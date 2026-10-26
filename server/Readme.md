
# Vakeel Vision — Backend

Backend API for **Vakeel Vision**, an AI-powered legal document analysis application. Built with FastAPI, SQLModel, PostgreSQL, pgvector, and Google Gemini.

## Features

- Create, list, retrieve, update, and delete document records.
- Upload PDF documents and extract selectable text.
- Normalize and store extracted document content.
- Split document text into chunks with page metadata.
- Generate embeddings using Google Gemini.
- Store vector embeddings in PostgreSQL using pgvector.
- Perform semantic search using cosine similarity.
- Generate answers based on relevant document excerpts.
- Return source references with answers.
- Create documents directly from text.

## Tech Stack

- **Python** — Backend language
- **FastAPI** — REST API framework
- **SQLModel** — Database models and ORM
- **PostgreSQL** — Relational database
- **pgvector** — Vector storage and similarity search
- **Google Gemini** — Embeddings and answer generation
- **LangChain** — Model integration and text processing
- **pypdf** — PDF text extraction
- **Alembic** — Database migrations
- **Docker Compose** — Local development environment

## API Endpoints

The document router uses the `/documents` prefix.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/documents/` | Create a document record |
| GET | `/documents/` | List all documents |
| GET | `/documents/{document_id}` | Retrieve a document by ID |
| PATCH | `/documents/{document_id}` | Update document details |
| DELETE | `/documents/{document_id}` | Delete a document and its stored file, where applicable |
| POST | `/documents/upload` | Upload and process a PDF |
| GET | `/documents/{document_id}/content` | Retrieve extracted document content |
| POST | `/documents/text` | Create a document from text |
| POST | `/documents/{document_id}/ask` | Ask a question about a document |
| POST | `/documents/{document_id}/embeddings` | Retrieve relevant chunks and source metadata for a question |

## How It Works

### 1. PDF Upload and Processing

When a user uploads a PDF:

1. Validate the uploaded file.
2. Save the PDF through the document storage service.
3. Extract text and page information.
4. Reject PDFs with no selectable text.
5. Store document metadata and extracted content.
6. Split the document into manageable chunks.
7. Generate an embedding for each chunk using Gemini.
8. Store chunks and embeddings in PostgreSQL.
9. Commit the database transaction.

### 2. Semantic Search

When a user submits a question:

1. Convert the question into an embedding.
2. Compare the query embedding with stored document embeddings.
3. Retrieve the most relevant chunks using cosine similarity.
4. Return the retrieved passages and their source metadata.

### 3. Document Question Answering

The `/documents/{document_id}/ask` endpoint:

1. Verifies that the document exists.
2. Generates an embedding for the question.
3. Retrieves relevant chunks from that document.
4. Passes the retrieved excerpts to the Gemini chat model.
5. Returns the generated answer and source references.

The answer response contains:

- `document_id`
- `question`
- `answer`
- `sources`

Each source includes its label, chunk ID, chunk index, page number, distance, and text.

## Example: Ask a Question

**Endpoint**

`POST /documents/1/ask`

**Request body**

```json
{
  "question": "What are the termination conditions in this agreement?",
  "top_k": 5
}
```

`top_k` specifies the maximum number of relevant chunks to retrieve. The current schema allows values from 1 to 10, with a default of 5.

**Response structure**

```json
{
  "document_id": 1,
  "question": "What are the termination conditions in this agreement?",
  "answer": "The document states the applicable termination conditions. [Source 1]",
  "sources": [
    {
      "label": "Source 1",
      "chunk_id": 10,
      "chunk_index": 0,
      "page_number": 1,
      "distance": 0.12,
      "text": "Example excerpt from the document..."
    }
  ]
}
```

The response values above are illustrative, not actual application output.

## Example: Upload a PDF

**Endpoint**

`POST /documents/upload`

Send a `multipart/form-data` request with a file field named `file`.

The current implementation accepts files with a `.pdf` extension and requires extractable text. OCR for scanned or image-only PDFs is not currently included in this workflow.

## Project Structure

```text
server/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── documents.py
│   ├── db/
│   │   └── dependencies.py
│   ├── models/
│   ├── schemas/
│   └── services/
│       ├── analysis_service.py
│       ├── document_content.py
│       ├── document_processing.py
│       ├── document_storage.py
│       ├── embedding_service.py
│       ├── retrieval_service.py
│       └── text_preprocessing.py
├── alembic/
├── alembic.ini
├── Dockerfile
└── requirements.txt
```

## Local Development

### Prerequisites

- Python 3.11 or compatible version
- Docker Desktop
- Docker Compose
- Google Gemini API credentials

### Start the Application

Run the following command from the project root, where your `compose.yaml` or `docker-compose.yml` is located:

```bash
docker compose up -d --build
```

### Apply Database Migrations

Run the migration command from the project root:

```bash
docker compose exec api python -m alembic upgrade head
```

This assumes your API service is named `api` and Alembic is configured inside the container.

### Open API Documentation

When the API is running locally on port 8000, open:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database

The backend uses PostgreSQL to store document metadata, extracted content, chunks, and embeddings.

The pgvector extension enables vector similarity search.

Alembic is used to manage database schema changes. Use migrations rather than manually creating production tables.

## Environment Variables and Secrets

Configure the database connection and Google Gemini credentials using the environment variables expected by your application.

- Keep `.env` files out of version control.
- Never commit API keys or database passwords.
- Never expose Gemini API credentials in frontend code.
- Use separate configuration for development and production.

## Current Limitations

- Google authentication has not yet been implemented.
- Document ownership and per-user authorization checks are still pending.
- PDF processing currently requires selectable text; OCR is not included.
- Answer generation depends on Gemini model availability and API limits.
- Production deployment requires durable file storage, backups, HTTPS, monitoring, and secure secret management.

**Security warning:** Do not expose the current API publicly with confidential documents until authentication and authorization have been implemented. The current document endpoints do not enforce per-user ownership.

## Roadmap

- Implement Google Sign-In.
- Add authenticated users and document ownership.
- Secure document access and all protected API routes.
- Build a Next.js and TypeScript frontend.
- Deploy the frontend and API to AWS EC2.
- Configure `vakeel.boardify.space` and `api-vakeel.boardify.space`.
- Add background workers, caching, monitoring, and scaling as required.

## Disclaimer

Vakeel Vision is intended to help users understand legal documents. AI-generated answers may be incomplete or inaccurate and should not replace advice from a qualified legal professional.

