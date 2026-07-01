from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse
from app.utils.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
  # Check if email exists
  existing_user = db.query(User).filter(User.email == user_in.email).first()
  if existing_user:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Email is already registered"
    )

  hashed_password = get_password_hash(user_in.password)
  new_user = User(
    name=user_in.name,
    email=user_in.email,
    password=hashed_password
  )
  db.add(new_user)
  db.commit()
  db.refresh(new_user)

  token = create_access_token(data={"sub": new_user.email})
  return {"token": token, "user": new_user}

@router.post("/login")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.email == user_in.email).first()
  if not user or not verify_password(user_in.password, user.password):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid credentials"
    )

  token = create_access_token(data={"sub": user.email})
  return {"token": token, "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
  return current_user
