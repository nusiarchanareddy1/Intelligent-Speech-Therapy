import re
from typing import List, Dict, Any

try:
  import pronouncing
  PRONOUNCING_AVAILABLE = True
except ImportError:
  PRONOUNCING_AVAILABLE = False
  print("Warning: pronouncing library not installed. Using basic phonetic rules.")

# A simple fallback dictionary for basic words if CMU Pronouncing Dictionary is offline
BASIC_PHONEME_MAP = {
  "the": ["DH", "AH"],
  "quick": ["K", "W", "IH", "K"],
  "brown": ["B", "R", "AW", "N"],
  "fox": ["F", "AA", "K", "S"],
  "jumps": ["JH", "AH", "M", "P", "S"],
  "over": ["OW", "V", "ER"],
  "lazy": ["L", "EY", "Z", "IY"],
  "dog": ["D", "AO", "G"],
  "she": ["SH", "IY"],
  "sells": ["S", "EH", "L", "Z"],
  "seashells": ["S", "IY", "SH", "EH", "L", "Z"],
  "by": ["B", "AY"],
  "seashore": ["S", "IY", "SH", "AO", "R"]
}

# IPA mapping lookup table
CMU_TO_IPA = {
  "AA": "ɑ", "AE": "æ", "AH": "ʌ", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ",
  "EH": "ɛ", "ER": "ɝ", "EY": "eɪ", "IH": "ɪ", "IY": "i", "OW": "oʊ",
  "OY": "ɔɪ", "UH": "ʊ", "UW": "u", "B": "b", "CH": "tʃ", "D": "d",
  "DH": "ð", "F": "f", "G": "g", "HH": "h", "JH": "dʒ", "K": "k",
  "L": "l", "M": "m", "N": "n", "NG": "ŋ", "P": "p", "R": "r",
  "S": "s", "SH": "ʃ", "T": "t", "TH": "θ", "V": "v", "W": "w",
  "Y": "j", "Z": "z", "ZH": "ʒ"
}

def get_word_phonemes(word: str) -> List[str]:
  """Gets CMU pronunciation phonemes for a word."""
  clean_word = re.sub(r'[^a-zA-Z]', '', word).lower()
  if not clean_word:
    return []

  if PRONOUNCING_AVAILABLE:
    try:
      phones = pronouncing.phones_for_word(clean_word)
      if phones:
        # Take the first pronunciation option and split into phonemes (strip stress numbers)
        raw_phonemes = phones[0].split()
        return [re.sub(r'\d', '', p) for p in raw_phonemes]
    except Exception as e:
      print(f"Pronouncing lookup error: {str(e)}")

  # Fallback to local map or naive character representation
  if clean_word in BASIC_PHONEME_MAP:
    return BASIC_PHONEME_MAP[clean_word]

  # Naive letter-to-phoneme converter fallback
  phones = []
  for char in clean_word:
    char_up = char.upper()
    if char_up in CMU_TO_IPA:
      phones.append(char_up)
    else:
      phones.append("AH") # Default vowel filler
  return phones

def phoneme_to_ipa(phoneme: str) -> str:
  """Converts CMU phoneme string to standard IPA symbol."""
  return f"/{CMU_TO_IPA.get(phoneme, phoneme.lower())}/"

def align_phonemes(reference_text: str, transcribed_text: str) -> List[Dict[str, Any]]:
  """Aligns transcription words with reference words to calculate phoneme-level match maps."""
  ref_words = reference_text.replace(".", "").replace(",", "").replace("?", "").replace("!", "").split()
  trans_words = transcribed_text.replace(".", "").replace(",", "").replace("?", "").replace("!", "").split()
  
  trans_set = set([w.lower() for w in trans_words])

  alignment = []
  for w in ref_words:
    clean_w = re.sub(r'[^a-zA-Z]', '', w)
    is_correct = clean_w.lower() in trans_set

    # Pick up phonemes
    cmu_phonemes = get_word_phonemes(clean_w)
    
    phonemes_detail = []
    word_score = 95 if is_correct else 35
    word_status = 'correct' if is_correct else 'incorrect'

    for ph in cmu_phonemes:
      ph_status = 'correct' if is_correct else 'incorrect'
      
      # Make a random phoneme incorrect inside incorrect words
      if not is_correct:
        import random
        ph_status = random.choice(['incorrect', 'correct', 'missed'])

      ph_score = 98 if ph_status == 'correct' else (40 if ph_status == 'incorrect' else 0)
      
      tip = "Great mouth shape and air flow."
      if ph_status == 'incorrect':
        if ph in ["S", "SH", "Z", "ZH"]:
          tip = "Tongue tip elevation mismatch. Keep lips slightly rounded."
        elif ph in ["TH", "DH"]:
          tip = "Fricative obstruction error. Place tongue between front teeth."
        elif ph in ["R", "L"]:
          tip = "Liquid consonant shift. Raise tongue tip towards alveolar ridge."
        else:
          tip = "Watch your lip shape and air flow volume."
      elif ph_status == 'missed':
        tip = "Sound was omitted. Exhale smoothly while pronouncing this phoneme."

      phonemes_detail.append({
        "phoneme": ph,
        "ipa": phoneme_to_ipa(ph),
        "status": ph_status,
        "score": ph_score,
        "tip": tip
      })

    alignment.append({
      "word": w,
      "status": word_status,
      "score": word_score,
      "phonemes": phonemes_detail
    })

  return alignment
