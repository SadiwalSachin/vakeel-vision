from app.core.security import generate_verification_token, hash_token
from app.models import EmailVerificationToken, User

from datetime import datetime, timezone, timedelta
from sqlmodel import Session

def create_verification_token(
    user:User,
    session:Session
):  
    # Generate the raw token that will eventually go into the email.
    raw_token = generate_verification_token()
    
    # Store only the token's hash in the database
    token_hash = hash_token(raw_token)
    
    # Make the token expires after 30min
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    
    # Create the databse record
    verification_token = EmailVerificationToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    
    session.add(verification_token)
    session.flush()
    
    # Return the raw token to the caller for email delivery
    return raw_token
    
    