from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Assessment, Score, Feedback
from app.schemas.schemas import AssessmentDetailsResponse
from app.utils.auth_utils import get_current_user, User

router = APIRouter(prefix="/assessment", tags=["Assessments"])

@router.get("/{assessment_id}", response_model=AssessmentDetailsResponse)
def get_assessment_details(
  assessment_id: int,
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  assessment = db.query(Assessment).filter(
    Assessment.id == assessment_id, 
    Assessment.user_id == current_user.id
  ).first()

  if not assessment:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Assessment report not found or unauthorized access"
    )

  scores = db.query(Score).filter(Score.assessment_id == assessment_id).first()
  feedback = db.query(Feedback).filter(Feedback.assessment_id == assessment_id).first()

  # Create defaults if missing to protect against serialization failures
  if not scores:
    scores = Score(
      assessment_id=assessment_id,
      pronunciation_score=0.0,
      fluency_score=0.0,
      grammar_score=0.0,
      confidence_score=0.0,
      overall_score=0.0
    )
  if not feedback:
    feedback = Feedback(
      assessment_id=assessment_id,
      feedback="No feedback generated for this assessment session."
    )

  return {
    "assessment": assessment,
    "scores": scores,
    "feedback": feedback
  }
