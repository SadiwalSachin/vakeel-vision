from sqlmodel import SQLModel, Field
from datetime import datetime
from pydantic import EmailStr

class RegisterRequest(SQLModel):
    name: str = Field(min_length=1,max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
    
    
class UserResponse(SQLModel):
    id: int
    name: str
    email: EmailStr
    is_email_verified: bool
    created_at: datetime
    
# It will be a raw token string, not a hash. The server will hash it before storing it in the database.
class VerifyEmailRequest(SQLModel):
    token: str = Field(min_length=1)
    
class LoginRequest(SQLModel):
    email: EmailStr
    password: str = Field(min_length=8)
    
class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"


class RefreshResponse(TokenResponse):
    pass


class ForgotPasswordRequest(SQLModel):
    # Email address of the account requesting a reset
    email: EmailStr


class ResetPasswordRequest(SQLModel):
    # Raw, one-time token received through the reset link
    token: str = Field(min_length=1)

    # Enforce a minimum password length
    new_password: str = Field(min_length=8)

class ResendVerificationRequest(SQLModel):
    email: EmailStr