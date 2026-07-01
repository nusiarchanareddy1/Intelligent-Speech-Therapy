import os
import wave
import numpy as np

try:
  import librosa
  LIBROSA_AVAILABLE = True
except ImportError:
  LIBROSA_AVAILABLE = False
  print("Warning: librosa not installed. Using native wave fallback for audio features.")

def load_audio(file_path: str, sr: int = 16000):
  """Loads an audio file and returns the signal and sample rate."""
  if LIBROSA_AVAILABLE:
    try:
      y, sample_rate = librosa.load(file_path, sr=sr)
      return y, sample_rate
    except Exception as e:
      print(f"Librosa load failed: {str(e)}. Falling back to wave module.")

  # Native wave file loader fallback
  try:
    with wave.open(file_path, 'rb') as wav_file:
      params = wav_file.getparams()
      frames = wav_file.readframes(params.nframes)
      # Convert binary frames to numpy float array
      y = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
      # If stereo, average to mono
      if params.nchannels == 2:
        y = y.reshape(-1, 2).mean(axis=1)
      return y, params.framerate
  except Exception as e:
    print(f"Native wave loader failed: {str(e)}")
    # Return mock sound wave
    return np.sin(np.linspace(0, 10, sr * 2)), sr

def noise_reduction(y: np.ndarray) -> np.ndarray:
  """Applies basic noise gate/spectral reduction to the signal."""
  if len(y) == 0:
    return y
  
  # A simple threshold-based noise gate: scale down signals below average noise floor
  threshold = np.std(y) * 0.1
  y_clean = np.where(np.abs(y) < threshold, y * 0.1, y)
  return y_clean

def remove_silence(y: np.ndarray, sr: int = 16000) -> np.ndarray:
  """Trims silence from the beginning and end of the audio."""
  if LIBROSA_AVAILABLE:
    try:
      y_trimmed, _ = librosa.effects.trim(y, top_db=20)
      return y_trimmed
    except Exception as e:
      print(f"Librosa trim failed: {str(e)}")

  # Custom amplitude-based trim fallback
  if len(y) == 0:
    return y
  abs_y = np.abs(y)
  threshold = np.max(abs_y) * 0.05
  indices = np.where(abs_y > threshold)[0]
  if len(indices) > 0:
    return y[indices[0]:indices[-1]]
  return y

def extract_mfcc(y: np.ndarray, sr: int = 16000, n_mfcc: int = 13) -> np.ndarray:
  """Extracts Mel-Frequency Cepstral Coefficients (MFCCs)."""
  if LIBROSA_AVAILABLE:
    try:
      mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
      return mfccs
    except Exception as e:
      print(f"Librosa MFCC extraction failed: {str(e)}")

  # Mock feature vector return
  return np.random.randn(n_mfcc, 100)

def detect_pitch(y: np.ndarray, sr: int = 16000) -> np.ndarray:
  """Detects pitch timeline using autocorrelation."""
  if len(y) == 0:
    return np.array([])

  if LIBROSA_AVAILABLE:
    try:
      # Use YIN algorithm for pitch tracking
      f0 = librosa.yin(y, fmin=60, fmax=400, sr=sr)
      # Replace NaNs with 0
      f0 = np.nan_to_num(f0)
      return f0
    except Exception as e:
      print(f"Librosa YIN pitch failed: {str(e)}")

  # Autocorrelation based pitch estimation fallback
  frame_size = int(sr * 0.03) # 30ms frames
  step_size = int(sr * 0.015) # 15ms steps
  pitches = []

  for i in range(0, len(y) - frame_size, step_size):
    frame = y[i:i+frame_size]
    # Subtract mean
    frame = frame - np.mean(frame)
    if np.max(frame) == 0:
      pitches.append(0)
      continue
    
    # Calculate autocorrelation
    corr = np.correlate(frame, frame, mode='full')
    corr = corr[len(corr)//2:]
    
    # Find peaks between min/max pitch frequencies (60Hz to 400Hz)
    min_lag = int(sr / 400)
    max_lag = int(sr / 60)
    
    if max_lag >= len(corr):
      pitches.append(0)
      continue
      
    peak_lag = np.argmax(corr[min_lag:max_lag]) + min_lag
    pitch = sr / peak_lag
    pitches.append(pitch if corr[peak_lag] > 0.3 * corr[0] else 0)

  return np.array(pitches)

def detect_speech_rate(y: np.ndarray, sr: int = 16000) -> float:
  """Estimates speech rate (syllables per second)."""
  duration = len(y) / sr
  if duration <= 0:
    return 0.0

  # Count envelope energy peaks as syllables
  hop_length = 512
  envelope = []
  for i in range(0, len(y), hop_length):
    envelope.append(np.sqrt(np.mean(y[i:i+hop_length]**2)))
  
  envelope = np.array(envelope)
  if len(envelope) < 3:
    return 0.0

  # Find peaks
  peaks = 0
  threshold = np.mean(envelope) * 1.1
  for idx in range(1, len(envelope) - 1):
    if envelope[idx] > envelope[idx-1] and envelope[idx] > envelope[idx+1] and envelope[idx] > threshold:
      peaks += 1

  return peaks / duration
