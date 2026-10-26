from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, BackgroundTasks
from app.db.dependencies import get_session
from sqlmodel import Session, select
from app.schemas.auth import RegisterRequest, UserResponse, VerifyEmailRequest, LoginRequest, RefreshResponse, ForgotPasswordRequest, ResetPasswordRequest, ResendVerificationRequest
from app.models import AuthIdentity, User, EmailVerificationToken, RefreshSession, PasswordResetToken
from app.core.security import hash_password, verify_password, hash_token, create_access_token, generate_refresh_token, create_refresh_token_hash, generate_verification_token
from app.services.email_verification import create_verification_token
from datetime import datetime, timezone, timedelta
from app.api.dependencies.auth import get_current_user
from sqlalchemy import select as sqlalchemy_select
from app.services.email_service import send_verification_email, send_reset_password_email

import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth",tags=["auth"])


REFRESH_TOKEN_EXPIRE_DAYS = 7


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    payload: RegisterRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    normalized_email = payload.email.strip().lower()

    try:
        statement = select(User).where(User.email == normalized_email)
        existing_user = session.exec(statement).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        hashed_password = hash_password(payload.password)

        new_user = User(
            name=payload.name.strip(),
            email=normalized_email,
            is_email_verified=False,
        )
        session.add(new_user)
        session.flush()

        new_identity = AuthIdentity(
            user_id=new_user.id,
            provider="password",
            password_hash=hashed_password,
        )
        session.add(new_identity)

        verification_token = create_verification_token(
            user=new_user,
            session=session,
        )

        # Save the user, identity, and token first.
        session.commit()
        session.refresh(new_user)

    except HTTPException:
        session.rollback()
        raise

    except Exception:
        session.rollback()
        logger.exception("Registration failed")
        raise

    # Schedule email delivery after the transaction succeeds.
    background_tasks.add_task(
        send_verification_email,
        to_email=new_user.email,
        verification_token=verification_token,
    )

    return new_user

    
@router.post("/verify-email")
def verify_email(
    payload: VerifyEmailRequest,
    session: Session = Depends(get_session),
):
    # 1. Hash the raw token to match the hash stored in the database
    token_hash = hash_token(payload.token)

    # 2. Find the matching verification token
    statement = select(EmailVerificationToken).where(
        EmailVerificationToken.token_hash == token_hash
    )
    verification_token = session.exec(statement).first()

    # 3. Reject unknown tokens
    if verification_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token.",
        )

    # 4. Reject tokens that have already been used
    if verification_token.used_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification token has already been used.",
        )

    # 5. Reject expired tokens
    if verification_token.expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired.",
        )

    try:
        # 6. Find the user who owns this token
        user = session.get(User, verification_token.user_id)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User associated with this token was not found.",
            )

        # 7. Mark the token as used and verify the user's email
        now = datetime.now(timezone.utc)
        verification_token.used_at = now
        user.is_email_verified = True

        # 8. Save both changes in one transaction
        session.add(verification_token)
        session.add(user)
        session.commit()

        return {"message": "Email verified successfully."}

    except Exception:
        session.rollback()
        raise
            
        
@router.post("/login")
def login_user(
    payload:LoginRequest,
    response:Response,
    session:Session = Depends(get_session),
):
    normalized_email = payload.email.strip().lower()
    
    statement = select(User).where(User.email == normalized_email)
    user = session.exec(statement=statement).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.", 
        )
        
    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )
        
    identify_statement = select(AuthIdentity).where(
        AuthIdentity.user_id == user.id,
        AuthIdentity.provider == "password"
    )
    
    identity = session.exec(identify_statement).first()
    
    if identity is None or identity.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
        
    if not verify_password(payload.password,identity.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )
        
    access_token = create_access_token(user_id=user.id)

    raw_refresh_token = generate_refresh_token()

    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=create_refresh_token_hash(raw_refresh_token),
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )

    session.add(refresh_session)

    session.commit()

    # Send the raw refresh token in an HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=True,  # Local HTTP development only; use True in production HTTPS.
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth",
    )

    # Return only the access token in the response body
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
    
    
@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    # Return only the fields allowed by UserResponse
    return current_user


@router.post("/refresh", response_model=RefreshResponse)
def refresh_access_token(
    response: Response,
    session: Session = Depends(get_session),
    refresh_token: str | None = Cookie(default=None),
):
    # 1. Require the refresh-token cookie
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is missing.",
        )

    # 2. Hash the incoming token to find its database record
    incoming_hash = create_refresh_token_hash(refresh_token)

    try:
        # Lock the session row to prevent simultaneous refresh requests
        statement = (
            select(RefreshSession)
            .where(RefreshSession.token_hash == incoming_hash)
            .with_for_update()
        )
        stored_session = session.exec(statement).first()

        now = datetime.now(timezone.utc)

        # 3. Reject unknown, revoked, or expired sessions
        if (
            stored_session is None
            or stored_session.revoked_at is not None
            or stored_session.expires_at <= now
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token is invalid or expired.",
            )

        # 4. Confirm that the account still exists and is active
        user = session.get(User, stored_session.user_id)

        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive.",
            )

        # 5. Revoke the old refresh session
        stored_session.revoked_at = now
        session.add(stored_session)

        # 6. Generate and store a replacement refresh session
        new_raw_token = generate_refresh_token()
        new_session = RefreshSession(
            user_id=user.id,
            token_hash=create_refresh_token_hash(new_raw_token),
            expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        )
        session.add(new_session)

        # 7. Commit rotation before issuing credentials
        session.commit()

        # 8. Replace the refresh cookie
        response.set_cookie(
            key="refresh_token",
            value=new_raw_token,
            httponly=True,
            secure=False,  # Local HTTP only; True in production HTTPS
            samesite="lax",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            path="/auth",
        )

        # 9. Issue a fresh access token
        return RefreshResponse(
            access_token=create_access_token(user_id=user.id),
            token_type="bearer",
        )

    except HTTPException:
        session.rollback()
        raise
    except Exception:
        session.rollback()
        raise
    
    
@router.post("/logout")
def logout_user(
    response: Response,
    session: Session = Depends(get_session),
    refresh_token: str | None = Cookie(default=None),
):
    try:
        # Revoke the current refresh session if a cookie exists
        if refresh_token:
            token_hash = create_refresh_token_hash(refresh_token)

            statement = select(RefreshSession).where(
                RefreshSession.token_hash == token_hash
            )
            stored_session = session.exec(statement).first()

            if (
                stored_session is not None
                and stored_session.revoked_at is None
            ):
                stored_session.revoked_at = datetime.now(timezone.utc)
                session.add(stored_session)

        # Persist revocation before clearing the browser cookie
        session.commit()

        response.delete_cookie(
            key="refresh_token",
            path="/auth",
            httponly=True,
            secure=False,  # Use True in production HTTPS
            samesite="lax",
        )

        return {"message": "Logged out successfully."}

    except Exception:
        session.rollback()
        raise


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    generic_message = (
        "If an account exists for this email, "
        "password-reset instructions will be sent."
    )

    normalized_email = payload.email.strip().lower()

    statement = select(User).where(User.email == normalized_email)
    user = session.exec(statement).first()

    # Do not reveal whether an account exists.
    if user is None or not user.is_active:
        return {"message": generic_message}

    try:
        
        now = datetime.now(timezone.utc)
        
        existing_tokens = session.exec(
            select(PasswordResetToken).where(
                PasswordResetToken.user_id == user.id,
                PasswordResetToken.used_at.is_(None)
            )
        ).all()
        
        for old_token in existing_tokens:
            old_token.used_at = now
            session.add(old_token)
        
        # Generate a random, one-time reset token.
        raw_token = generate_verification_token()

        # Store only its hash in PostgreSQL.
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=(
                now + timedelta(minutes=30)
            ),
        )

        session.add(reset_token)
        session.commit()

    except Exception:
        session.rollback()
        logger.exception("Failed to create password-reset token")
        raise

    # Schedule delivery only after the database commit succeeds.
    background_tasks.add_task(
        send_reset_password_email,
        to_email=user.email,
        reset_token=raw_token,
    )

    return {"message": generic_message}


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    session: Session = Depends(get_session),
):
    # Hash the submitted raw token to find its database record
    incoming_hash = hash_token(payload.token)

    statement = select(PasswordResetToken).where(
        PasswordResetToken.token_hash == incoming_hash
    )

    try:
        reset_token = session.exec(statement).first()
        now = datetime.now(timezone.utc)

        # Reject unknown tokens
        if reset_token is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password-reset token.",
            )

        # Reject tokens that have already been used
        if reset_token.used_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password-reset token.",
            )

        # Reject expired tokens
        if reset_token.expires_at <= now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password-reset token.",
            )

        # Find the password identity associated with this user
        identity_statement = select(AuthIdentity).where(
            AuthIdentity.user_id == reset_token.user_id,
            AuthIdentity.provider == "password",
        )
        identity = session.exec(identity_statement).first()

        if identity is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset is unavailable for this account.",
            )

        # Hash the new password using Argon2
        identity.password_hash = hash_password(payload.new_password)

        # Consume the one-time reset token
        reset_token.used_at = now

        session.add(identity)
        session.add(reset_token)
        
        # Revoke all active refresh sessions for this user.
        active_sessions_statement = select(RefreshSession).where(
            RefreshSession.user_id == reset_token.user_id,
            RefreshSession.revoked_at.is_(None),
        )

        active_sessions = session.exec(active_sessions_statement).all()
        now = datetime.now(timezone.utc)

        for refresh_session in active_sessions:
            refresh_session.revoked_at = now
            session.add(refresh_session)
        session.commit()

        return {"message": "Password has been reset successfully."}

    except HTTPException:
        session.rollback()
        raise
    except Exception:
        session.rollback()
        raise


@router.post("/resend-verification")
def resend_verification(
    payload: ResendVerificationRequest,
    background_tasks:BackgroundTasks,
    session: Session = Depends(get_session),
):
    # Use the same response regardless of account status
    generic_message = (
        "If an eligible account exists for this email, "
        "a verification link will be sent."
    )

    normalized_email = payload.email.strip().lower()

    statement = select(User).where(User.email == normalized_email)
    user = session.exec(statement).first()

    # Do not reveal whether an account exists or is already verified
    if user is None or user.is_email_verified or not user.is_active:
        return {"message": generic_message}

    try:
        now = datetime.now(timezone.utc)

        # Invalidate previously issued, unused verification tokens
        old_tokens_statement = select(EmailVerificationToken).where(
            EmailVerificationToken.user_id == user.id,
            EmailVerificationToken.used_at.is_(None),
        )
        old_tokens = session.exec(old_tokens_statement).all()

        for old_token in old_tokens:
            old_token.used_at = now
            session.add(old_token)

        # Create a new token; only its hash is stored in PostgreSQL
        raw_token = create_verification_token(
            user=user,
            session=session,
        )

        session.commit()
        
    except Exception:
        session.rollback()
        logger.exception("Failed to create verification token")
        raise
    
    background_tasks.add_task(
        send_verification_email,
        to_email=user.email,
        verification_token=raw_token
    )
    
    return {"message": generic_message}
    
    
