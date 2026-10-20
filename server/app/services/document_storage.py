import os
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR","uploads"))
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024
 
# It takes a file sent by a user, checks its size, and saves it safely to your server's disk using a randomly generated unique name.

async def save_upload_file(upload:UploadFile) -> tuple[str,int]:
    """Save an upload safely and return its storage key and file size."""
    
    UPLOAD_DIR.mkdir(parents=True,exist_ok=True)
    
    # Generate our own name; never use the user's filename as a disk path.
    storage_key = f"{uuid4().hex}.pdf"
    destination = UPLOAD_DIR / storage_key
    total_size = 0
    
    try:
        with destination.open("wb") as output_file:
            while True:
                chunk = await upload.read(CHUNK_SIZE)
                
                if not chunk:
                    break
                
                total_size += len(chunk)
                
                if total_size > MAX_UPLOAD_SIZE_BYTES:
                    raise HTTPException(
                        status_code=413,
                        detail="File exceeds the 10 MB upload limit.",
                    )
                    
                output_file.write(chunk)
        
        
        if total_size == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        # Verify the PDF file signature.
        with destination.open("rb") as saved_file:
            signature = saved_file.read(5)

        if signature != b"%PDF-":
            raise HTTPException(
                status_code=400,
                detail="The uploaded file does not have a valid PDF signature.",
            )

        return storage_key, total_size

    
    except Exception:
        destination.unlink(missing_ok=True)
        
        
def delete_uploaded_file(storage_key:str)-> None:
    """Delete a stored upload using its storage key."""
    
    storage_root = UPLOAD_DIR.resolve()
    
    file_path = (storage_root / storage_key).resolve()
    
    # Prevent a storage key from targeting files outside the upload directory.
    
    if file_path.parent != storage_key:
        raise ValueError("Invalid storage key")
    
    file_path.unlink(missing_ok=True)
                 

def get_uploaded_file_path(storage_key:str)-> Path:
    """Resolve a stored upload's local path safely."""
    
    storage_root = UPLOAD_DIR.resolve()
    
    file_path = (storage_root / storage_key).resolve()
    
    # Prevent path traversal outside the upload directory.
    if file_path.parent != storage_root:
        raise ValueError("Invalid storage key.")

    return file_path

 