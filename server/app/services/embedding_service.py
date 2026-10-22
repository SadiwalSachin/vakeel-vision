from langchain_google_genai import GoogleGenerativeAIEmbeddings


EMBEDDING_DIMENSIONS = 1536

EMBEDDING_MODEL = "gemini-embedding-2"

def get_embedding_model()-> GoogleGenerativeAIEmbeddings:
    """Create the configured Gemini embedding model."""
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        output_dimensionality=EMBEDDING_DIMENSIONS
    )
    
    
def generate_document_embedding(text:str)->list[float]:
    """Generate an embedding for a document chunk."""
    
    if not text or not text.strip():
        raise ValueError("Text to embeed cannor be empty.")
    
    model = get_embedding_model()
    
    # Gemini Embedding 2 uses task instructions in the text input.
    document_input = (
        "task: search_document\n"
        "title: Legal document chunk\n"
        f"text: {text.strip()}"
    )
    
    print("document",document_input)
    
    embedding = model.embed_query([document_input][0])
    
    if len(embedding) != EMBEDDING_DIMENSIONS:
        raise ValueError(
            f"Expected {EMBEDDING_DIMENSIONS} dimensions, "
            f"received {len(embedding)}."
        )
        
    return embedding 


def generate_query_embedding(query:str)->list[float]:
    """Generate an embedding for a user query."""
    
    if not query or not query.strip():
        raise ValueError("Query to embed cannot be empty.")
    
    model = get_embedding_model()
    
    # Gemini Embedding 2 uses task instructions in the text input.
    query_input = (
        "task: search_query\n"
        "title: User search query\n"
        f"text: {query.strip()}"
    )
    
    embedding = model.embed_query([query_input][0])
    
    if len(embedding) != EMBEDDING_DIMENSIONS:
        raise ValueError(
            f"Expected {EMBEDDING_DIMENSIONS} dimensions, "
            f"received {len(embedding)}."
        )
        
    return embedding