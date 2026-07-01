import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routes import auth, speech, assessment, feedback, exercise, progress, history, profile

# Ensure static uploads directories are created
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
os.makedirs(os.path.join(STATIC_DIR, "audio"), exist_ok=True)

# Build SQLite database tables automatically at startup
Base.metadata.create_all(bind=engine)

# Auto-seed database with clinical dummy profiles if first run
try:
  from app.seed import seed_database
  seed_database()
except Exception as e:
  print(f"Auto-seeding skipped: {str(e)}")

app = FastAPI(
  title="Intelligent Speech Therapy Platform API",
  description="Backend clinical server supporting user authorization, scoring records, and logs storage.",
  version="1.0.0"
)

# CORS configuration to accept requests from React frontend
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"], # In production, restrict this to Vite port 3000 or production domains
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Mount Static Files for recorded audio playback
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register REST endpoints
app.include_router(auth.router, prefix="/api")
app.include_router(speech.router, prefix="/api")
app.include_router(assessment.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(exercise.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(profile.router, prefix="/api")

@app.get("/")
def root():
  return {
    "status": "healthy",
    "service": "Speech Therapy platform backend API",
    "docs": "/docs"
  }
