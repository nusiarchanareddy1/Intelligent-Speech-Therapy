from typing import List

def recommend_focus_areas(overall_score: float, pronunciation_score: float, fluency_score: float) -> List[str]:
  """Analyzes scores to recommend specific therapy practice modules."""
  recommendations = []

  if pronunciation_score < 80:
    recommendations.append("Prioritize phoneme placement drills. Practice slow articulation of target sounds before repeating full sentences.")
    recommendations.append("Read the target sentence word-by-word and compare your recording to the native therapist audio guidance.")

  if fluency_score < 75:
    recommendations.append("Focus on breathing and phrasing. Try reading the text in short, rhythmic breath groups (sense-groups).")
    recommendations.append("Reduce speaking rate slightly. Rushing often causes articulation drop-offs and increased hesitation counts.")

  if overall_score >= 85:
    recommendations.append("Excellent job! Try increasing reading speed or practicing complex multi-syllabic vocabulary words.")
    recommendations.append("Try practicing with custom conversational prose to verify natural speech flow.")

  # Ensure we always return at least two recommendations
  if len(recommendations) < 2:
    recommendations.append("Maintain consistent daily recordings to lock in correct tongue and lip habits.")
    recommendations.append("Integrate mirror-work: watch your jaw opening and lip rounding shape while pronouncing vowels.")

  return recommendations
