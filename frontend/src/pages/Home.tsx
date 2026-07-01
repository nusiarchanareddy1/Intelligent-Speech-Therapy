import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Volume2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-gradient-to-b from-indigo-950/10 via-background to-background">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold text-primary animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Speech Evaluation Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Unlock Clear, Confident Spoken English with{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Adaptive AI Therapy
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Evaluate your pronunciation down to the individual phoneme, receive real-time speech suggestions, and track progress using personalized therapy exercises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Start Free Assessment</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-card border text-card-foreground font-semibold px-8 py-4 rounded-2xl shadow hover:bg-muted transition-all duration-300"
              >
                Explore Science
              </Link>
            </div>

            {/* Quick Demo Preview */}
            <div className="mt-16 border rounded-3xl overflow-hidden shadow-2xl glass max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
              <div className="bg-muted/80 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Interactive Assessment Dashboard</span>
                <div className="w-8" />
              </div>
              <div className="p-6 md:p-8 bg-card flex flex-col md:flex-row items-center gap-8 text-left">
                <div className="flex-1 space-y-4">
                  <div className="text-xs font-bold text-primary uppercase">Example Target Sentence</div>
                  <blockquote className="text-xl font-bold text-foreground">
                    "She sells seashells by the seashore."
                  </blockquote>
                  <div className="flex items-center space-x-3 bg-muted/40 p-3 rounded-xl border">
                    <Volume2 className="h-5 w-5 text-indigo-500" />
                    <span className="text-xs font-medium text-muted-foreground">Press play to listen to native guide pronunciation.</span>
                  </div>
                </div>
                <div className="w-full md:w-[320px] bg-muted/20 border rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Pronunciation Score</span>
                    <span className="text-emerald-500">92% (Excellent)</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[92%]" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Weak Phoneme Targeted</span>
                    <span className="text-rose-500">/ʃ/ ("sh")</span>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-xl text-[11px] text-rose-500">
                    Acoustic mismatch detected in "shells". Open your lips slightly wider.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-card border-t border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Clinically-Inspired Speech Therapy Tools
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-md">
                Our platform leverages advanced phoneme-alignment models to break down your speaking capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background border rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Speech Recording & Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Record directly in your browser. Get word-by-word correctness feedback, acoustics verification, and speech-rate markers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background border rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="bg-indigo-500/10 text-indigo-500 p-3 rounded-2xl w-fit">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Phoneme-Level Breakdown</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identify exactly which phonemes (consonant or vowel sounds) were omitted or mispronounced with simple guide sheets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background border rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-2xl w-fit">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Progress & Adaptive Practice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track your speech scoring history over days, weeks, and months. Receive adaptive exercises matching your specific weaknesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Validation Banner */}
        <section className="py-20 relative overflow-hidden bg-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="mx-auto bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-full w-fit text-indigo-500">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Secure, Private, and Developer-Ready</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Your audio files are processed secure-only and your clinical reports are kept safely encrypted. Built using Python, FastAPI, and JWT.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
export { Home };
