import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, AlertCircle } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

interface SpeechRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(userStream);

      const mediaRecorder = new MediaRecorder(userStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start(250); // Get data slices every 250ms
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Temporarily disable trigger on stop
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    stopTimer();
    setRecordingTime(0);
    audioChunksRef.current = [];

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto p-6 bg-card rounded-3xl border shadow-xl">
      <div className="text-center">
        <h3 className="text-lg font-bold">Audio Recorder</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isRecording ? 'Recording in progress...' : 'Click record and read the sentence out loud'}
        </p>
      </div>

      <WaveformVisualizer stream={stream} isRecording={isRecording} />

      <div className="flex items-center space-x-6">
        {isRecording && (
          <button
            onClick={cancelRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            title="Cancel Recording"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white pulse-ring'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? <Square className="h-6 w-6 fill-current" /> : <Mic className="h-6 w-6" />}
        </button>

        {isRecording && (
          <div className="text-sm font-mono bg-muted px-4 py-2 rounded-full border text-muted-foreground animate-pulse">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-2xl border border-destructive/20 w-full">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
export { SpeechRecorder };
