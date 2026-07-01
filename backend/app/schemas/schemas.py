from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token Schemas
class Token(BaseModel):
  access_token: str
  token_type: str

class TokenData(BaseModel):
  email: Optional[str] = None


# User Schemas
class UserBase(BaseModel):
  email: EmailStr
  name: str

class UserCreate(UserBase):
  password: str

class UserLogin(BaseModel):
  email: EmailStr
  password: str

class UserResponse(UserBase):
  id: int
  created_at: datetime

  class Config:
    from_attributes = True


# Profile Settings Schemas
class ProfileUpdate(BaseModel):
  name: str
  email: EmailStr
  target_accent: Optional[str] = "General American (US)"
  daily_goal: Optional[int] = 3

class SettingsResponse(BaseModel):
  target_accent: str
  daily_goal: int

  class Config:
    from_attributes = True


# Score Schemas
class ScoreBase(BaseModel):
  pronunciation_score: float
  fluency_score: float
  grammar_score: float
  confidence_score: float
  overall_score: float

class ScoreResponse(ScoreBase):
  id: int
  assessment_id: int

  class Config:
    from_attributes = True


# Feedback Schemas
class FeedbackBase(BaseModel):
  feedback: str

class FeedbackResponse(FeedbackBase):
  id: int
  assessment_id: int

  class Config:
    from_attributes = True


# Recommendation Schemas
class RecommendationResponse(BaseModel):
  id: int
  user_id: int
  recommendation: str

  class Config:
    from_attributes = True


# Assessment Schemas
class AssessmentResponse(BaseModel):
  id: int
  user_id: int
  sentence: str
  audio_path: Optional[str] = None
  assessment_date: datetime

  class Config:
    from_attributes = True

class AssessmentDetailsResponse(BaseModel):
  assessment: AssessmentResponse
  scores: ScoreResponse
  feedback: FeedbackResponse

  class Config:
    from_attributes = True


# Exercise Schemas
class ExerciseBase(BaseModel):
  exercise: str
  difficulty: str

class ExerciseCreate(ExerciseBase):
  pass

class ExerciseResponse(ExerciseBase):
  id: int
  user_id: int
  completed: bool

  class Config:
    from_attributes = True


# Progress Schemas
class ProgressResponse(BaseModel):
  id: int
  user_id: int
  assessment_date: datetime
  overall_score: float
  improvement_percentage: float

  class Config:
    from_attributes = True

class DashboardStatsResponse(BaseModel):
  overallAverage: float
  pronunciationAverage: float
  fluencyAverage: float
  grammarAverage: float
  confidenceAverage: float
  improvementRate: float
  weakPhonemes: List[str]
  totalAssessments: int
  completedExercises: int
  weeklyProgress: List[dict]


# History Schemas
class HistoryItemResponse(BaseModel):
  id: int
  assessment_id: int
  sentence: str
  overall_score: float
  pronunciation_score: float
  fluency_score: float
  assessment_date: datetime

  class Config:
    from_attributes = True
