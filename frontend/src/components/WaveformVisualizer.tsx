import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ stream, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Simple fallback animation when NOT recording
    const drawPlaceholder = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;

      // Draw a slow moving sine wave
      const time = Date.now() * 0.004;
      for (let x = 0; x < width; x++) {
        const y = (height / 2) + Math.sin(x * 0.02 + time) * 4 * Math.sin(x * 0.005);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawPlaceholder);
    };

    if (!isRecording || !stream) {
      // If we had active audio nodes, clean them up
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      drawPlaceholder();
      return;
    }

    // Set up Web Audio API analyzer
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);

      audioCtxRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawLive = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * (height * 0.85);

          // Beautiful blue to violet gradient
          const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(0.5, '#6366f1');
          gradient.addColorStop(1, '#8b5cf6');

          ctx.fillStyle = gradient;
          
          // Draw rounded bars
          const y = height - barHeight;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 2, barHeight, 4);
          ctx.fill();

          x += barWidth;
        }

        animationRef.current = requestAnimationFrame(drawLive);
      };

      drawLive();
    } catch (err) {
      console.error('Audio analyzer setup failed, falling back to dummy visualizer:', err);
      drawPlaceholder();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stream, isRecording]);

  return (
    <div className="w-full bg-slate-950/40 rounded-2xl p-4 border border-white/5 relative overflow-hidden backdrop-blur-md">
      <canvas ref={canvasRef} className="w-full h-24 block" />
      {isRecording && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </div>
  );
};

export default WaveformVisualizer;
export { WaveformVisualizer };
