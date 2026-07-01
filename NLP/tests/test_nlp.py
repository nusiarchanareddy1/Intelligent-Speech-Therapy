import pytest
import numpy as np
from fastapi.testclient import TestClient
from main import app
from utils import clean_text
from speech_scoring import evaluate_grammar, calculate_pronunciation_score

client = TestClient(app)

def test_nlp_root():
  response = client.get("/")
  assert response.status_code == 200
  assert "whisper_enabled" in response.json()

def test_clean_text():
  assert clean_text("Hello, world! This is a test...") == "hello world this is a test"
  assert clean_text("Read standard. Sentences.") == "read standard sentences"

def test_evaluate_grammar():
  ref = "She sells seashells by the seashore"
  trans_perfect = "She sells seashells by the seashore"
  trans_error = "She sells shells by the seashore" # Missed 'sea' prefix

  assert evaluate_grammar(ref, trans_perfect) == 100.0
  assert evaluate_grammar(ref, trans_error) < 100.0

def test_pronunciation_score_calculation():
  # Define mock alignment grid
  mock_alignment = [
    {
      "word": "hello",
      "status": "correct",
      "phonemes": [
        {"phoneme": "HH", "status": "correct"},
        {"phoneme": "AH", "status": "correct"},
        {"phoneme": "L", "status": "correct"},
        {"phoneme": "OW", "status": "correct"}
      ]
    },
    {
      "word": "world",
      "status": "incorrect",
      "phonemes": [
        {"phoneme": "W", "status": "correct"},
        {"phoneme": "ER", "status": "incorrect"},
        {"phoneme": "L", "status": "correct"},
        {"phoneme": "D", "status": "correct"}
      ]
    }
  ]

  # 7 correct out of 8 phonemes
  expected = (7 / 8) * 100.0
  assert calculate_pronunciation_score(mock_alignment) == round(expected, 1)
