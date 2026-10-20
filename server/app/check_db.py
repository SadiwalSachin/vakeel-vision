# Here we are just testing that is our tables created or not for that we are using this code snippent

from sqlalchemy import inspect

# import the create_db_and_tables function created in the db/session.py file to create the tables
from db.session import create_db_and_tables,engine

create_db_and_tables()


# We need to inspect the tables
inspector = inspect(engine)
tables = inspector.get_table_names()

print("Tables found",tables)
assert "document" in tables, "Document tables was not created"

print("Database verification successful!")
