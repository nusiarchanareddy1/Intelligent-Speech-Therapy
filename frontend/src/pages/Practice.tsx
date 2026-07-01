import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import RecommendationCard from '../components/RecommendationCard';
import { exerciseService, Exercise } from '../services/api';
import { BookOpen, Sparkles, Filter } from 'lucide-react';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');

  const fetchExercises = async () => {
    try {
      const data = await exerciseService.getExercises();
      setExercises(data);
    } catch (err) {
      console.warn('Backend exercise endpoints offline. Loading default speech training drills:', err);
      setExercises([
        { id: 1, user_id: 1, exercise: 'Practice voiceless "th" in "thin", "thick", and "health"', difficulty: 'Beginner', completed: false },
        { id: 2, user_id: 1, exercise: 'Contrast minimal pairs: "sheep" vs "ship" and "heat" vs "hit"', difficulty: 'Intermediate', completed: false },
        { id: 3, user_id: 1, exercise: 'Read 3 sentences targeting syllable stress in compound nouns', difficulty: 'Intermediate', completed: true },
        { id: 4, user_id: 1, exercise: 'Tongue-twister: "She sells seashells by the seashore" (Slow & Clear)', difficulty: 'Beginner', completed: false },
        { id: 5, user_id: 1, exercise: 'Tongue-twister: "Peter Piper picked a peck of pickled peppers" (Speed drill)', difficulty: 'Advanced', completed: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await exerciseService.completeExercise(id);
      setExercises(prev =>
        prev.map(ex => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
      );
    } catch {
      setExercises(prev =>
        prev.map(ex => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
      );
    }
  };

  const handlePracticeNow = (text: string) => {
    // Navigate to assessment with the exercise text loaded in state or query
    navigate(`/assessment?sentence=${encodeURIComponent(text)}`);
  };

  const handleGenerateDrills = async () => {
    setLoading(true);
    try {
      const newDrills = await exerciseService.generateNewExercises();
      setExercises(newDrills);
    } catch {
      // Add a couple mock items
      setExercises(prev => [
        ...prev,
        { id: Date.now(), user_id: 1, exercise: 'Contrast alveolar plosives: "tin" vs "din"', difficulty: 'Beginner', completed: false },
        { id: Date.now() + 1, user_id: 1, exercise: 'Intonation patterns: reading WH-questions vs Yes/No questions', difficulty: 'Intermediate', completed: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    if (filter === 'todo') return !ex.completed;
    if (filter === 'completed') return ex.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Speech Practice Center</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Clinical exercises designed to practice targeted phoneme transitions.
              </p>
            </div>
            <button
              onClick={handleGenerateDrills}
              className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-2xl shadow hover:bg-primary/95 transition-all duration-200"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>Generate Custom Drills</span>
            </button>
          </div>

          {loading ? (
            <Loader message="Synthesizing personalized exercises..." />
          ) : (
            <div className="space-y-6">
              {/* Filters container */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border px-6 py-4 rounded-3xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4.5 w-4.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Filter Exercises:</span>
                </div>
                <div className="flex space-x-2">
                  {(['all', 'todo', 'completed'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        filter === f
                          ? 'bg-primary text-primary-foreground border-transparent'
                          : 'hover:bg-muted border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f === 'all' && 'All Drills'}
                      {f === 'todo' && 'To Do'}
                      {f === 'completed' && 'Completed'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExercises.map((ex) => (
                  <RecommendationCard
                    key={ex.id}
                    id={ex.id}
                    title={ex.exercise}
                    type="Clinical Drill"
                    difficulty={ex.difficulty}
                    completed={ex.completed}
                    onComplete={handleComplete}
                    onAction={() => handlePracticeNow(ex.exercise)}
                  />
                ))}
                {filteredExercises.length === 0 && (
                  <div className="col-span-2 text-center p-12 bg-card border rounded-3xl space-y-3">
                    <BookOpen className="h-10 w-10 text-muted-foreground/35 mx-auto" />
                    <h4 className="text-md font-bold text-muted-foreground">No Exercises Found</h4>
                    <p className="text-xs text-muted-foreground">
                      Try updating the filter selector or generate new customized drills using the button above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Practice;
export { Practice };
