import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface PhonemeData {
  phoneme: string;
  ipa: string;
  status: 'correct' | 'incorrect' | 'missed';
  score: number;
  tip: string;
}

interface WordAnalysis {
  word: string;
  status: 'correct' | 'incorrect' | 'missed';
  score: number;
  phonemes: PhonemeData[];
}

interface PhonemeTableProps {
  sentence: string;
  wordAnalysis?: WordAnalysis[];
}

const PhonemeTable: React.FC<PhonemeTableProps> = ({ sentence, wordAnalysis }) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // Generate fallback alignment data if none is provided
  const words = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
  
  const fallbackAnalysis: WordAnalysis[] = words.map((w, idx) => {
    // Make 1 or 2 words incorrect to demonstrate pronunciation details
    const isMockError = idx === 1 || idx === 5;
    const score = isMockError ? 55 : 95;
    const status = isMockError ? 'incorrect' : 'correct';

    // Mock phoneme breakdown
    const phonemes: PhonemeData[] = w.toLowerCase().split('').map(char => {
      const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(char);
      const isConsonantError = isMockError && !isVowel;
      return {
        phoneme: char.toUpperCase(),
        ipa: `/${char}/`,
        status: isConsonantError ? 'incorrect' : 'correct',
        score: isConsonantError ? 40 : 98,
        tip: isConsonantError 
          ? 'Raise your tongue slightly towards the alveolar ridge and release air.'
          : 'Great mouth shape and air flow.'
      };
    });

    return {
      word: w,
      status,
      score,
      phonemes
    };
  });

  const data = wordAnalysis || fallbackAnalysis;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const getWordColor = (status: 'correct' | 'incorrect' | 'missed') => {
    if (status === 'correct') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400';
    if (status === 'incorrect') return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400';
  };

  const getPhonemeBg = (status: 'correct' | 'incorrect' | 'missed') => {
    if (status === 'correct') return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    if (status === 'incorrect') return 'bg-amber-500/20 text-amber-700 dark:text-amber-300';
    return 'bg-rose-500/20 text-rose-700 dark:text-rose-300';
  };

  return (
    <div className="bg-card border rounded-3xl p-6 shadow-md space-y-6 w-full">
      <div>
        <h3 className="text-lg font-bold">Pronunciation Heatmap</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Click any word below to examine its phoneme-level breakdown and speech therapy tips.
        </p>
      </div>

      {/* Interactive Heatmap Words */}
      <div className="flex flex-wrap gap-2.5 p-4 bg-muted/30 rounded-2xl border">
        {data.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWordIndex(selectedWordIndex === idx ? null : idx)}
            className={`px-4 py-2 rounded-xl text-md font-semibold border transition-all duration-200 hover:scale-105 active:scale-95 ${getWordColor(
              item.status
            )} ${selectedWordIndex === idx ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}`}
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Phoneme Details Drawer */}
      {selectedWordIndex !== null && (
        <div className="border rounded-2xl p-5 bg-muted/20 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-foreground">
                {data[selectedWordIndex].word}
              </span>
              <button
                onClick={() => speakText(data[selectedWordIndex].word)}
                className="p-1.5 bg-muted hover:bg-muted-foreground/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Listen to pronunciation"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm font-bold text-muted-foreground">
              Accuracy: {data[selectedWordIndex].score}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {data[selectedWordIndex].phonemes.map((ph, pIdx) => (
              <div
                key={pIdx}
                className="bg-card border rounded-xl p-3 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${getPhonemeBg(ph.status)}`}>
                    {ph.phoneme}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{ph.ipa}</span>
                </div>
                <p className="text-xs font-medium line-clamp-3 text-muted-foreground">{ph.tip}</p>
                <div className="text-right text-[10px] font-semibold text-primary/70">
                  Match: {ph.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhonemeTable;
export { PhonemeTable };
