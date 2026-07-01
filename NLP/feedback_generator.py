from typing import List, Dict, Any

def generate_feedback(alignment: List[Dict[str, Any]], overall_score: float) -> str:
  """Generates written speech therapy feedback targeting mispronounced phonemes."""
  incorrect_phonemes = set()
  missed_phonemes = set()

  for word in alignment:
    for ph in word.get("phonemes", []):
      status = ph.get("status")
      symbol = ph.get("phoneme")
      if status == "incorrect":
        incorrect_phonemes.add(symbol)
      elif status == "missed":
        missed_phonemes.add(symbol)

  feedback_parts = []

  if overall_score >= 85:
    feedback_parts.append("Excellent articulation! Your pronunciation was highly intelligible, showing native-like phoneme accuracy and rhythm.")
  elif overall_score >= 70:
    feedback_parts.append("Good effort! Your speech was largely clear, but minor deviations in phoneme shapes were observed.")
  else:
    feedback_parts.append("Your speech was moderately intelligible. We detected several sound transitions that could be clarified with slow repetitions.")

  # Add targeted phoneme recommendations
  if incorrect_phonemes:
    ph_list = ", ".join([f"/{p}/" for p in sorted(list(incorrect_phonemes))[:3]])
    feedback_parts.append(
      f"Watch the articulation of {ph_list}. Focus on tongue positioning: for sibilant transitions (like 's' and 'sh'), ensure your tongue is slightly raised toward the alveolar ridge but leaves a small gap for air release."
    )

  if missed_phonemes:
    ph_list_m = ", ".join([f"/{p}/" for p in sorted(list(missed_phonemes))[:2]])
    feedback_parts.append(
      f"We noticed that {ph_list_m} sounds were omitted or dropped. Ensure you fully project sound boundaries and maintain steady breath support through word endings."
    )

  if not incorrect_phonemes and not missed_phonemes:
    feedback_parts.append("All vowel and consonant placements were correct. Try increasing speaking speed in practice to improve fluency.")

  return " ".join(feedback_parts)
