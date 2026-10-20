import os
from sqlmodel import SQLModel,create_engine
# Import all models so SQLModel registers every table.
from app.models import (Document,DocumentContent,DocumentAnalysis,AnalysisFinding)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./vakeel_vision.db",
)

# SQLite needs a special connection option.
# PostgreSQL does not need this option.
connect_args = (
    {"check_same_thread":False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(
    url=DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

def create_db_and_tables()->None:
    """Create database tables for registered SQLModel models."""
    SQLModel.metadata.create_all(engine)