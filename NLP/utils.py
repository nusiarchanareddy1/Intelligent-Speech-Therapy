import re

def clean_text(text: str) -> str:
  """Standardizes text by converting to lowercase and stripping punctuation."""
  text = text.lower()
  # Strip punctuation
  text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()?]', '', text)
  # Collapse multiple spaces
  text = re.sub(r'\s+', ' ', text)
  return text.strip()

def calculate_duration(signal: list, sample_rate: int) -> float:
  """Calculates audio duration in seconds."""
  if sample_rate == 0:
    return 0.0
  return len(signal) / sample_rate
