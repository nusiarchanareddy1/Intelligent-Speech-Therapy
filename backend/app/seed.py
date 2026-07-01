import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.models import User, Assessment, Score, Feedback, Exercise, Progress, History
from app.utils.auth_utils import get_password_hash

def seed_database():
  # Create tables if not exists
  Base.metadata.create_all(bind=engine)
  
  db: Session = SessionLocal()
  try:
    # 1. Check if user already exists
    demo_email = "therapist@luminaspeech.com"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
      print("Database already seeded with demo user.")
      return

    print("Seeding database with clinical therapy records...")
    
    # 2. Create Demo User
    hashed_pw = get_password_hash("therapy123")
    user = User(
      name="Therapy Demo User",
      email=demo_email,
      password=hashed_pw,
      target_accent="General American (US)",
      daily_goal=3
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Create historical Assessments, Scores, and Feedbacks
    assessments_data = [
      {
        "sentence": "The quick brown fox jumps over the lazy dog.",
        "days_ago": 5,
        "scores": {"pronunciation": 72.0, "fluency": 68.0, "grammar": 90.0, "confidence": 65.0, "overall": 73.8},
        "feedback": "Overall articulation was moderately intelligible. Noticeable hesitation occurred during the transition from 'jumps' to 'over'. Consonants were soundly formed but lacked peak breath support.",
        "recs": ["Practice transition drills from sibilant 's' to vowels", "Slow down speaking rate to 2 syllables per second"]
      },
      {
        "sentence": "Peter Piper picked a peck of pickled peppers.",
        "days_ago": 3,
        "scores": {"pronunciation": 78.0, "fluency": 72.0, "grammar": 95.0, "confidence": 70.0, "overall": 78.8},
        "feedback": "Good plosive sound projection on the 'p' consonants. Some rushing occurred near the center phrases ('picked a peck'), leading to overlapping transitions. Steady your phrasing rhythm.",
        "recs": ["Read using short breath boundaries", "Use a metronome set to 80 BPM to stabilize speaking tempo"]
      },
      {
        "sentence": "She sells seashells by the seashore.",
        "days_ago": 1,
        "scores": {"pronunciation": 84.0, "fluency": 80.0, "grammar": 95.0, "confidence": 75.0, "overall": 83.5},
        "feedback": "Excellent sibilant contrast articulation! The separation between 'sells' and 'seashells' showed clear tongue tip control. Breath flow was steady, yielding solid confidence metrics.",
        "recs": ["Great progress, attempt complex multi-syllable phrases", "Maintain consistent daily exercises"]
      }
    ]

    for item in assessments_data:
      date = datetime.datetime.utcnow() - datetime.timedelta(days=item["days_ago"])
      
      # Save assessment
      ass = Assessment(
        user_id=user.id,
        sentence=item["sentence"],
        audio_path="",
        assessment_date=date
      )
      db.add(ass)
      db.commit()
      db.refresh(ass)

      # Save scores
      sc = Score(
        assessment_id=ass.id,
        pronunciation_score=item["scores"]["pronunciation"],
        fluency_score=item["scores"]["fluency"],
        grammar_score=item["scores"]["grammar"],
        confidence_score=item["scores"]["confidence"],
        overall_score=item["scores"]["overall"]
      )
      db.add(sc)

      # Save feedback
      fb = Feedback(
        assessment_id=ass.id,
        feedback=item["feedback"]
      )
      db.add(fb)

      # Save progress
      prog = Progress(
        user_id=user.id,
        assessment_date=date,
        overall_score=item["scores"]["overall"],
        improvement_percentage=round(item["scores"]["overall"] - 73.8, 1) # simple comparison to first run
      )
      db.add(prog)

      # Save history
      hist = History(
        user_id=user.id,
        assessment_id=ass.id,
        created_at=date
      )
      db.add(hist)

    # 4. Create active exercises
    exercises = [
      Exercise(user_id=user.id, exercise='Practice voiceless "th" in "thin" and "mouth"', difficulty='Beginner', completed=False),
      Exercise(user_id=user.id, exercise='Vowel length contrast drill: "sheep" vs "ship"', difficulty='Intermediate', completed=True),
      Exercise(user_id=user.id, exercise='Read 3 sentences targeting syllable stress placement', difficulty='Intermediate', completed=False),
      Exercise(user_id=user.id, exercise='Tongue-twister: "red lorry, yellow lorry" (3x speed)', difficulty='Advanced', completed=False)
    ]
    for ex in exercises:
      db.add(ex)

    db.commit()
    print("Database seeding completed successfully!")
  except Exception as e:
    db.rollback()
    print(f"Error during seeding: {str(e)}")
  finally:
    db.close()

if __name__ == "__main__":
  seed_database()
