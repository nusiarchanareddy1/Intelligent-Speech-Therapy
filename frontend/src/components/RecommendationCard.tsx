import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

interface RecommendationCardProps {
  id: number;
  title: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed?: boolean;
  onComplete?: (id: number) => void;
  onAction?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  title,
  type,
  difficulty,
  completed = false,
  onComplete,
  onAction,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
    }
  };

  return (
    <div className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-start space-x-4 relative overflow-hidden group">
      {/* Decorative gradient strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-indigo-500" />

      <div className="flex-1 space-y-3 pl-1.5">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {type}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        <h4 className="text-md font-bold text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h4>

        <div className="flex items-center space-x-4">
          {onComplete && (
            <button
              onClick={() => onComplete(id)}
              className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Completed</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  <span>Mark Done</span>
                </>
              )}
            </button>
          )}

          {onAction && (
            <button
              onClick={onAction}
              className="flex items-center space-x-1 text-xs font-bold text-primary hover:text-indigo-500 transition-colors"
            >
              <span>Practice Now</span>
              <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="text-muted-foreground/20 group-hover:text-primary/10 transition-colors">
        <Sparkles className="h-8 w-8" />
      </div>
    </div>
  );
};

export default RecommendationCard;
export { RecommendationCard };
