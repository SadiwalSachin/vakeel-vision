from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class AnalysisFinding(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    analysis_id: int = Field(
        foreign_key="documentanalysis.id",
        index=True,
    )

    # Category of the legal issue.
    # Examples: termination, payment, liability, missing_clause.
    category: str = Field(max_length=100, index=True)

    # Risk level assigned to this specific finding.
    # Examples: low, medium, high.
    severity: str = Field(max_length=20, index=True)

    # Relevant clause text from the source document.
    clause_text: str | None = Field(default=None)

    # Explanation of why this clause deserves attention.
    explanation: str

    # Suggested question or action for the user to consider.
    recommendation: str | None = Field(default=None)

    # Page number where the clause was found, if available.
    page_number: int | None = Field(default=None, ge=1)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
