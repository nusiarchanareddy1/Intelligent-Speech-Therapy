from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import ProfileUpdate, SettingsResponse, UserResponse
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile Settings"])

@router.get("/settings", response_model=SettingsResponse)
def get_profile_settings(current_user: User = Depends(get_current_user)):
  return {
    "target_accent": current_user.target_accent,
    "daily_goal": current_user.daily_goal
  }

@router.put("/update", response_model=UserResponse)
def update_profile(
  profile_in: ProfileUpdate,
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db)
):
  # Check if email is already in use by another user
  if profile_in.email != current_user.email:
    existing = db.query(User).filter(User.email == profile_in.email).first()
    if existing:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email address is already registered to another account"
      )

  # Save updates
  current_user.name = profile_in.name
  current_user.email = profile_in.email
  current_user.target_accent = profile_in.target_accent or current_user.target_accent
  current_user.daily_goal = profile_in.daily_goal if profile_in.daily_goal is not None else current_user.daily_goal

  db.commit()
  db.refresh(current_user)

  return current_user
