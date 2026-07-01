import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Score, Assessment, Exercise, Progress
from app.schemas.schemas import DashboardStatsResponse, ProgressResponse
from app.utils.auth_utils import get_current_user, User

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])

@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats(
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  # Query scores belonging to user assessments
  user_scores = db.query(Score)\
    .join(Assessment)\
    .filter(Assessment.user_id == current_user.id)\
    .all()

  total_assessments = len(user_scores)
  
  if total_assessments == 0:
    # Return empty response metrics
    return {
      "overallAverage": 0.0,
      "pronunciationAverage": 0.0,
      "fluencyAverage": 0.0,
      "grammarAverage": 0.0,
      "confidenceAverage": 0.0,
      "improvementRate": 0.0,
      "weakPhonemes": [],
      "totalAssessments": 0,
      "completedExercises": 0,
      "weeklyProgress": []
    }

  # Calculate metric averages
  overall_avg = sum([s.overall_score for s in user_scores]) / total_assessments
  pron_avg = sum([s.pronunciation_score for s in user_scores]) / total_assessments
  flu_avg = sum([s.fluency_score for s in user_scores]) / total_assessments
  gram_avg = sum([s.grammar_score for s in user_scores]) / total_assessments
  conf_avg = sum([s.confidence_score for s in user_scores]) / total_assessments

  # Count completed exercises
  completed_exercises = db.query(Exercise)\
    .filter(Exercise.user_id == current_user.id, Exercise.completed == True)\
    .count()

  # Progress curve list - last 7 days of assessments
  recent_assessments = db.query(Assessment)\
    .join(Score)\
    .filter(Assessment.user_id == current_user.id)\
    .order_by(Assessment.assessment_date.asc())\
    .limit(7)\
    .all()

  weekly_progress = []
  for a in recent_assessments:
    weekly_progress.append({
      "date": a.assessment_date.isoformat(),
      "score": a.scores.overall_score if a.scores else 0.0
    })

  # Calculate improvement rate (last assessment score - first assessment score)
  improvement = 0.0
  if len(user_scores) >= 2:
    sorted_scores = sorted(user_scores, key=lambda s: s.id)
    first_score = sorted_scores[0].overall_score
    last_score = sorted_scores[-1].overall_score
    improvement = round(float(last_score - first_score), 1)

  # Collect weak phonemes (we mock these based on lower scores or default list)
  weak_phonemes = []
  if pron_avg < 85:
    weak_phonemes.append("TH (/θ/)")
  if flu_avg < 80:
    weak_phonemes.append("R (/r/)")
  if conf_avg < 75:
    weak_phonemes.append("L (/l/)")

  return {
    "overallAverage": round(overall_avg, 1),
    "pronunciationAverage": round(pron_avg, 1),
    "fluencyAverage": round(flu_avg, 1),
    "grammarAverage": round(gram_avg, 1),
    "confidenceAverage": round(conf_avg, 1),
    "improvementRate": improvement,
    "weakPhonemes": weak_phonemes,
    "totalAssessments": total_assessments,
    "completedExercises": completed_exercises,
    "weeklyProgress": weekly_progress
  }

@router.get("/history", response_model=list[ProgressResponse])
def get_progress_history(
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  records = db.query(Progress)\
    .filter(Progress.user_id == current_user.id)\
    .order_by(Progress.assessment_date.desc())\
    .all()
  return records
