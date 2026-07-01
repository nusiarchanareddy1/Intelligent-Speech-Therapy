import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file path definition
DATABASE_URL = "sqlite:///./speech_therapy.db"

# Create Database engine - disable same thread check for SQLite development
engine = create_engine(
  DATABASE_URL, 
  connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# DB Dependency generator
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
