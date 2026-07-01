import os
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Exercise, Score, Assessment
from app.schemas.schemas import ExerciseResponse
from app.utils.auth_utils import get_current_user, User

router = APIRouter(prefix="/exercise", tags=["Exercises"])

NLP_SERVICE_URL = os.getenv("NLP_SERVICE_URL", "http://localhost:8001")

@router.get("/list", response_model=list[ExerciseResponse])
def list_exercises(
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  exercises = db.query(Exercise).filter(Exercise.user_id == current_user.id).all()
  
  # Auto-populate some initial exercises if none exist
  if not exercises:
    initial_exercises = [
      Exercise(user_id=current_user.id, exercise='Practice voiceless "th" in "thin" and "mouth"', difficulty='Beginner', completed=False),
      Exercise(user_id=current_user.id, exercise='Vowel length contrast drill: "sheep" vs "ship"', difficulty='Intermediate', completed=False),
      Exercise(user_id=current_user.id, exercise='Read 3 sentences targeting syllable stress placement', difficulty='Intermediate', completed=False),
    ]
    for ex in initial_exercises:
      db.add(ex)
    db.commit()
    exercises = db.query(Exercise).filter(Exercise.user_id == current_user.id).all()

  return exercises

@router.put("/complete/{exercise_id}")
def complete_exercise(
  exercise_id: int,
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  exercise = db.query(Exercise).filter(
    Exercise.id == exercise_id, 
    Exercise.user_id == current_user.id
  ).first()

  if not exercise:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Exercise not found or unauthorized"
    )

  exercise.completed = not exercise.completed
  db.commit()
  db.refresh(exercise)
  return {"success": True, "exercise": exercise}

@router.post("/generate", response_model=list[ExerciseResponse])
def generate_exercises(
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  # Get recent assessments and scores to customize drills
  recent_assessments = db.query(Assessment)\
    .join(Score)\
    .filter(Assessment.user_id == current_user.id)\
    .order_back = Assessment.assessment_date.desc()\
    .limit(3)\
    .all()

  sentences = [a.sentence for a in recent_assessments]

  generated_drills = []
  try:
    response = requests.post(
      f"{NLP_SERVICE_URL}/nlp/generate-exercises",
      json={"sentences": sentences, "accent": current_user.target_accent},
      timeout=5
    )
    if response.status_code == 200:
      data = response.json()
      for item in data:
        generated_drills.append(
          Exercise(
            user_id=current_user.id,
            exercise=item.get("exercise"),
            difficulty=item.get("difficulty", "Beginner"),
            completed=False
          )
        )
  except Exception as e:
    print(f"NLP Service generation failed, generating fallback drills: {str(e)}")

  # Fallback generators
  if not generated_drills:
    generated_drills = [
      Exercise(user_id=current_user.id, exercise='Acoustic contrast drill: "ten" vs "den" sound projection', difficulty='Beginner', completed=False),
      Exercise(user_id=current_user.id, exercise='Practice tongue tip elevation with dental fricatives', difficulty='Intermediate', completed=False),
    ]

  for ex in generated_drills:
    db.add(ex)
  db.commit()

  # Return updated list
  return db.query(Exercise).filter(Exercise.user_id == current_user.id).all()
