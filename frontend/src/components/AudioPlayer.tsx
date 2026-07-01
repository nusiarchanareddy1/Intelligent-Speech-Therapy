import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset player on source change
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().catch(e => console.error(e));
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full bg-card rounded-2xl border p-4 shadow-md flex items-center space-x-4 max-w-xl mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <button
        onClick={togglePlay}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95"
      >
        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
      </button>

      <button
        onClick={handleRestart}
        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        title="Restart"
      >
        <RotateCcw className="h-5 w-5" />
      </button>

      <div className="flex-1 flex items-center space-x-2">
        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-xs font-mono text-muted-foreground w-10">
          {formatTime(duration)}
        </span>
      </div>

      <button
        onClick={toggleMute}
        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="h-5 w-5 text-destructive" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default AudioPlayer;
export { AudioPlayer };
