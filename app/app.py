from sqlalchemy import create_engine 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker 
import os 
import dotenv
 
DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    raise ValueError("Could not connect to database")
    
engine = create_engine(DB_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autoCommit=False)


Base = declarative_base()

def get_db():
   db = SessionLocal()
   try:
       yield db
   finally:
       db.close() 