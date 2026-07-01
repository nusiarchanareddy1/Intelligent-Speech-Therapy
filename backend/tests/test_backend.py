import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Create in-memory SQLite database for testing isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_speech_therapy.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
  Base.metadata.create_all(bind=engine)
  yield
  Base.metadata.drop_all(bind=engine)

def override_get_db():
  try:
    db = TestingSessionLocal()
    yield db
  finally:
    db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_root_endpoint():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json()["status"] == "healthy"

def test_user_lifecycle():
  # 1. Register User
  reg_payload = {
    "name": "Test Therapist",
    "email": "test@luminaspeech.com",
    "password": "testpassword123"
  }
  response = client.post("/api/auth/register", json=reg_payload)
  assert response.status_code == 201
  assert "token" in response.json()
  
  # 2. Login User
  login_payload = {
    "email": "test@luminaspeech.com",
    "password": "testpassword123"
  }
  response = client.post("/api/auth/login", json=login_payload)
  assert response.status_code == 200
  token = response.json()["token"]
  assert token is not None

  # 3. Request Profile using token
  headers = {"Authorization": f"Bearer {token}"}
  response = client.get("/api/auth/me", headers=headers)
  assert response.status_code == 200
  assert response.json()["email"] == "test@luminaspeech.com"

  # 4. Fetch settings
  response = client.get("/api/profile/settings", headers=headers)
  assert response.status_code == 200
  assert "target_accent" in response.json()
