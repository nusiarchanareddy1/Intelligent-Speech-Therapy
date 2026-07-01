from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Assessment, Score
from app.schemas.schemas import HistoryItemResponse
from app.utils.auth_utils import get_current_user, User

router = APIRouter(prefix="/history", tags=["History Tracking"])

@router.get("/list", response_model=list[HistoryItemResponse])
def get_user_history(
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  # Perform a join of Assessment and Score
  records = db.query(
    Assessment.id.label("id"),
    Assessment.id.label("assessment_id"),
    Assessment.sentence.label("sentence"),
    Assessment.assessment_date.label("assessment_date"),
    Score.overall_score.label("overall_score"),
    Score.pronunciation_score.label("pronunciation_score"),
    Score.fluency_score.label("fluency_score")
  ).join(Score, Score.assessment_id == Assessment.id)\
   .filter(Assessment.user_id == current_user.id)\
   .order_by(Assessment.assessment_date.desc())\
   .all()

  # Format output to match Pydantic schema
  output = []
  for r in records:
    output.append({
      "id": r.id,
      "assessment_id": r.assessment_id,
      "sentence": r.sentence,
      "overall_score": r.overall_score,
      "pronunciation_score": r.pronunciation_score,
      "fluency_score": r.fluency_score,
      "assessment_date": r.assessment_date
    })

  return output
