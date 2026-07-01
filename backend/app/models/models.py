import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  email = Column(String, unique=True, index=True, nullable=False)
  password = Column(String, nullable=False)
  created_at = Column(DateTime, default=datetime.datetime.utcnow)

  # Custom profile settings saved in model
  target_accent = Column(String, default="General American (US)")
  daily_goal = Column(Integer, default=3)

  assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
  exercises = relationship("Exercise", back_populates="user", cascade="all, delete-orphan")
  recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
  progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
  history_records = relationship("History", back_populates="user", cascade="all, delete-orphan")


class Assessment(Base):
  __tablename__ = "assessments"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  sentence = Column(String, nullable=False)
  audio_path = Column(String, nullable=True)
  assessment_date = Column(DateTime, default=datetime.datetime.utcnow)

  user = relationship("User", back_populates="assessments")
  scores = relationship("Score", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
  feedbacks = relationship("Feedback", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
  history_records = relationship("History", back_populates="assessment", cascade="all, delete-orphan")


class Score(Base):
  __tablename__ = "scores"

  id = Column(Integer, primary_key=True, index=True)
  assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
  pronunciation_score = Column(Float, default=0.0)
  fluency_score = Column(Float, default=0.0)
  grammar_score = Column(Float, default=0.0)
  confidence_score = Column(Float, default=0.0)
  overall_score = Column(Float, default=0.0)

  assessment = relationship("Assessment", back_populates="scores")


class Feedback(Base):
  __tablename__ = "feedback"

  id = Column(Integer, primary_key=True, index=True)
  assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
  feedback = Column(String, nullable=False)

  assessment = relationship("Assessment", back_populates="feedbacks")


class Exercise(Base):
  __tablename__ = "exercises"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  exercise = Column(String, nullable=False)
  difficulty = Column(String, default="Beginner") # Beginner, Intermediate, Advanced
  completed = Column(Boolean, default=False)

  user = relationship("User", back_populates="exercises")


class Recommendation(Base):
  __tablename__ = "recommendations"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  recommendation = Column(String, nullable=False)

  user = relationship("User", back_populates="recommendations")


class Progress(Base):
  __tablename__ = "progress"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  assessment_date = Column(DateTime, default=datetime.datetime.utcnow)
  overall_score = Column(Float, default=0.0)
  improvement_percentage = Column(Float, default=0.0)

  user = relationship("User", back_populates="progress_records")


class History(Base):
  __tablename__ = "history"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
  created_at = Column(DateTime, default=datetime.datetime.utcnow)

  user = relationship("User", back_populates="history_records")
  assessment = relationship("Assessment", back_populates="history_records")
