from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Assessment, Feedback
from app.schemas.schemas import FeedbackResponse
from app.utils.auth_utils import get_current_user, User

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("/{assessment_id}", response_model=FeedbackResponse)
def get_assessment_feedback(
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
      detail="Assessment not found or unauthorized access"
    )

  feedback = db.query(Feedback).filter(Feedback.assessment_id == assessment_id).first()
  if not feedback:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Feedback not found for this assessment"
    )

  return feedback
