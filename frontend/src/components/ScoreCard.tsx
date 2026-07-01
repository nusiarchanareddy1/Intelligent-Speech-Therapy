import React from 'react';
import { Award, Zap, BookOpen, ShieldAlert } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  score: number;
  type: 'overall' | 'pronunciation' | 'fluency' | 'grammar' | 'confidence';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, type }) => {
  // Score color mapping helper
  const getColor = (val: number) => {
    if (val >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 70) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getBgColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (val >= 70) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  };

  const icons = {
    overall: Award,
    pronunciation: Zap,
    fluency: BookOpen,
    grammar: BookOpen, // fallback or re-use
    confidence: ShieldAlert,
  };

  const IconComponent = icons[type] || Award;
  const strokeClass = getColor(score);
  const bgClass = getBgColor(score);

  // SVG parameters for circle progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between">
      <div className="space-y-3">
        <div className={`p-2.5 rounded-2xl border w-fit ${bgClass}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold tracking-tight mt-0.5">{score}%</p>
        </div>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-muted fill-none"
            strokeWidth="6"
          />
          {/* Progress Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`fill-none transition-all duration-1000 ease-out ${strokeClass}`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-foreground">
          {score}
        </span>
      </div>
    </div>
  );
};

export default ScoreCard;
export { ScoreCard };
