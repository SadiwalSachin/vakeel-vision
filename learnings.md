### Till now we have created the document model
### now we will register the doument model like we have to connect this model with the db or db setup
so for registering the model we simply use this code 


def create_db_and_tables()->None:

    """Create database tables for registered SQLModel models."""

    SQLModel.metadata.create_all(engine)

 created_at: datetime = Field(default_factory=lambda:datetime.now(timezone.utc)) 
 this default_factory generate a fresh utc timestamp for each new record

# After this we just created a script to test wether the tables are created or not

Why use a separate script?
It lets us verify database setup without changing your FastAPI endpoints or triggering table creation whenever the application starts.

so the script is in the check_db.py file 

# now we will move to the docker compose file to run the postgress instance 



