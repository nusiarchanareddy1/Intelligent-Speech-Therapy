import numpy as np
from typing import List, Dict, Any

def calculate_pronunciation_score(alignment: List[Dict[str, Any]]) -> float:
  """Calculates overall pronunciation score based on phoneme correctness ratios."""
  total_phonemes = 0
  correct_phonemes = 0

  for word in alignment:
    for ph in word.get("phonemes", []):
      total_phonemes += 1
      if ph.get("status") == "correct":
        correct_phonemes += 1

  if total_phonemes == 0:
    return 80.0 # Default starting threshold
    
  score = (correct_phonemes / total_phonemes) * 100.0
  return round(float(score), 1)

def calculate_fluency_score(speech_rate: float, silence_duration: float, total_duration: float) -> float:
  """Calculates fluency index utilizing speech rate and duration metrics."""
  # Average conversational speech rate is 3-4 syllables per second.
  # If speech rate is between 2.5 and 4.5, award top scores.
  if speech_rate == 0:
    return 50.0

  rate_score = 100.0
  if speech_rate < 2.2:
    rate_score = max(50.0, 100.0 - (2.2 - speech_rate) * 35.0)
  elif speech_rate > 5.0:
    rate_score = max(60.0, 100.0 - (speech_rate - 5.0) * 15.0)

  # Pause penalty
  pause_ratio = silence_duration / total_duration if total_duration > 0 else 0
  pause_penalty = 0.0
  if pause_ratio > 0.25:
    pause_penalty = min(40.0, (pause_ratio - 0.25) * 80.0)

  score = rate_score - pause_penalty
  return round(float(max(10.0, min(100.0, score))), 1)

def calculate_confidence_score(y: np.ndarray) -> float:
  """Estimates speaking confidence based on amplitude stability and variance."""
  if len(y) == 0:
    return 60.0

  rms = np.sqrt(np.mean(y**2))
  # Map RMS amplitude to a scale (higher volume stable RMS usually implies confidence)
  rms_scaled = min(100.0, rms * 400.0)
  
  # Standard deviation of signal segments (low variance in speaking energy = higher confidence)
  splits = np.array_split(y, 10)
  rms_segments = [np.sqrt(np.mean(s**2)) for s in splits if len(s) > 0]
  rms_var = np.var(rms_segments) if rms_segments else 0.0
  
  variance_penalty = min(30.0, rms_var * 1000.0)
  score = rms_scaled - variance_penalty
  
  # Normalize to realistic bands
  score = 65.0 + (score / 3.0)
  return round(float(max(10.0, min(100.0, score))), 1)

def evaluate_grammar(reference_text: str, transcribed_text: str) -> float:
  """Evaluates word-matching similarity as a proxy for grammar/sentence reading accuracy."""
  ref = reference_text.lower().replace(".", "").replace(",", "").split()
  trans = transcribed_text.lower().replace(".", "").replace(",", "").split()

  if not ref:
    return 100.0

  # Compute Levenshtein distance or overlap ratio
  overlap = 0
  for w in ref:
    if w in trans:
      overlap += 1
      trans.remove(w) # Prevent multiple matches

  score = (overlap / len(ref)) * 100.0
  return round(float(score), 1)
