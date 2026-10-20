from fastapi.testclient import TestClient
import pytest
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.db.dependencies import get_session
from app.main import app


test_engine = create_engine(
    url="sqlite://",
    connect_args={"check_same_thread":False},
    poolclass=StaticPool
)


@pytest.fixture
def client():
    SQLModel.metadata.create_all(test_engine)
    
    def get_test_engine():
        with Session(test_engine) as session:
            yield session
            
    app.dependency_overrides[get_session] = get_test_engine
    
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        SQLModel.metadata.drop_all(test_engine)
        
        
def test_create_text_document_and_retrieve_content(client):
    payload = {
        "filename": "service-agreement.txt",
        "text": (
            "The client shall pay the agreed fees "
            "within 30 days of receiving an invoice."
        ),
    }

    # Create the document.
    response = client.post("/documents/text", json=payload)

    assert response.status_code == 201

    document = response.json()
    document_id = document["id"]

    assert document["filename"] == payload["filename"]
    assert document["source_type"] == "text"
    assert document["content_type"] == "text/plain"
    assert document["status"] == "processed"

    # Retrieve the stored extracted content.
    content_response = client.get(
        f"/documents/{document_id}/content"
    )

    assert content_response.status_code == 200

    content = content_response.json()

    assert content["document_id"] == document_id
    assert content["extracted_text"] == payload["text"]
    assert content["character_count"] == len(payload["text"])
    assert content["page_count"] is None
    assert content["extraction_completed"] is True
    