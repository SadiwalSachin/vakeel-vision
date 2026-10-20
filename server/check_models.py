
from sqlmodel import SQLModel

# Importing the models registers their table definitions.
from app.models import (
    Document,
    DocumentContent,
    DocumentAnalysis,
    AnalysisFinding,
)

expected_tables = {
    "document",
    "documentcontent",
    "documentanalysis",
    "analysisfinding",
}

registered_tables = set(SQLModel.metadata.tables.keys())

print("Registered tables:", sorted(registered_tables))

# Confirm that all expected tables are registered.
missing_tables = expected_tables - registered_tables
assert not missing_tables, f"Missing tables: {missing_tables}"

# Display and verify the foreign-key relationships.
for table in SQLModel.metadata.sorted_tables:
    for column in table.columns:
        for foreign_key in column.foreign_keys:
            print(
                f"{table.name}.{column.name}"
                f" -> {foreign_key.target_fullname}"
            )

print("All document models registered successfully!")
