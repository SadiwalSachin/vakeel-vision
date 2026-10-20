from fastapi import FastAPI
from app.api.routes.documents import router as documents_router

# Create FastAPI app instance
app = FastAPI(
    title="Vakeel Vision API",
    description="AI-assisted legal document analysis platform",
    version="0.1.0",
)

app.include_router(documents_router)

#Root enpoint: useful for confirming the API is running
@app.get("/")
def root():
    return {
        "message":"Welcome to Vakeel Vision API"
    }
    
@app.get("/health")
def health_check():
    return {
        "status":"healthy"
    }
    
