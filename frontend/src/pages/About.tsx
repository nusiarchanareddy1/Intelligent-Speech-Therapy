import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">About LuminaSpeech</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Scientific and technological backing of the AI-powered articulation platform.
            </p>
          </div>

          <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LuminaSpeech was developed to bridge the gap between traditional speech-language pathology clinic sessions and self-paced home practice. By combining state-of-the-art speech-to-text models with acoustic signal processing, we offer users immediate phoneme-level calibration feedback.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Whisper-Aligned Transcriptions</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    OpenAI Whisper transcription guarantees word correctness parsing even under heavily accented or disfluent speech.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-indigo-500/10 text-indigo-500 p-2.5 rounded-xl shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Acoustic Feature Verification</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Librosa computes MFCC features and pitch timelines to assess sibilant clarity, intonation contours, and silence counts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-xl shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Pathologist-Vetted Drills</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Our adaptive training recommendations focus on standard target syllables, tongue placement suggestions, and phonetic contrast.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-rose-500/10 text-rose-500 p-2.5 rounded-xl shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Secure Data Operations</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    All audio files and clinical stats are processed under secure tokens. We follow strict local-storage privacy practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
export { About };
