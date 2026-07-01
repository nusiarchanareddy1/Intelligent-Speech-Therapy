from typing import List, Dict, Any

def generate_custom_exercises(sentences: List[str], target_accent: str = "General American (US)") -> List[Dict[str, Any]]:
  """Generates targeted clinical exercises based on past read sentences and desired accents."""
  drills = []

  # Find if they had recent reading topics
  has_sibilant = False
  has_liquid = False

  for sent in sentences:
    lower_sent = sent.lower()
    if 'sh' in lower_sent or 's' in lower_sent or 'z' in lower_sent:
      has_sibilant = True
    if 'r' in lower_sent or 'l' in lower_sent:
      has_liquid = True

  # Customize training recommendations
  if has_sibilant:
    drills.append({
      "exercise": 'Tongue placement drills: separate "s" vs "sh" in "sells seashells"',
      "difficulty": "Intermediate"
    })
  if has_liquid:
    drills.append({
      "exercise": 'Liquid vowel transitions: contrast "red lorry" with "yellow lorry"',
      "difficulty": "Advanced"
    })

  # General additions
  if target_accent == "Received Pronunciation (UK)":
    drills.append({
      "exercise": 'Non-rhotic r drills: drop final "r" in "car" and "water" - substitute with schwa',
      "difficulty": "Intermediate"
    })
  else:
    drills.append({
      "exercise": 'Rhotic flap-T drills: practice "butter" and "water" using quick tap shapes',
      "difficulty": "Beginner"
    })

  # Safeguard drill count
  if len(drills) < 2:
    drills.append({
      "exercise": 'Voiceless fricative training: repeat "think", "teeth", "path" 5 times',
      "difficulty": "Beginner"
    })

  return drills
