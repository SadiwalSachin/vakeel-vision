from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.documents import router as documents_router
from app.api.routes.auth import router as auth_router

# Create FastAPI app instance
app = FastAPI(
    title="Vakeel Vision API",
    description="AI-assisted legal document analysis platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(documents_router)
app.include_router(auth_router)

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
    
