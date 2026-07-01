import axios from 'axios';

// Configure defaults for API requests
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token into authorization headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Score {
  id: number;
  assessment_id: number;
  pronunciation_score: number;
  fluency_score: number;
  grammar_score: number;
  confidence_score: number;
  overall_score: number;
}

export interface Feedback {
  id: number;
  assessment_id: number;
  feedback: string;
}

export interface Assessment {
  id: number;
  user_id: number;
  sentence: string;
  audio_path: string;
  assessment_date: string;
  scores?: Score[];
  feedbacks?: Feedback[];
}

export interface Exercise {
  id: number;
  user_id: number;
  exercise: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
}

export interface Recommendation {
  id: number;
  user_id: number;
  recommendation: string;
}

export interface ProgressData {
  id: number;
  user_id: number;
  assessment_date: string;
  overall_score: number;
  improvement_percentage: number;
}

export interface HistoryRecord {
  id: number;
  user_id: number;
  assessment_id: number;
  created_at: string;
  assessment?: Assessment;
}

// API Services
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export const assessmentService = {
  getSentences: async () => {
    // Returns a list of default practice sentences
    return [
      "The quick brown fox jumps over the lazy dog.",
      "She sells seashells by the seashore.",
      "Peter Piper picked a peck of pickled peppers.",
      "Artificial intelligence is transforming speech therapy exercises.",
      "To be or not to be, that is the question.",
      "Practice makes perfect when learning spoken pronunciation.",
      "Clean language analysis depends on high quality audio signals.",
      "Success in speech therapy is driven by consistent daily drills."
    ];
  },
  submitAudio: async (sentence: string, audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('sentence', sentence);
    formData.append('file', audioBlob, 'recording.wav');

    const response = await api.post<{
      assessment: Assessment;
      scores: Score;
      feedback: Feedback;
      recommendations: Recommendation[];
    }>('/speech/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getAssessmentDetails: async (assessmentId: number) => {
    const response = await api.get<{
      assessment: Assessment;
      scores: Score;
      feedback: Feedback;
    }>(`/assessment/${assessmentId}`);
    return response.data;
  }
};

export const progressService = {
  getStats: async () => {
    const response = await api.get<{
      overallAverage: number;
      pronunciationAverage: number;
      fluencyAverage: number;
      grammarAverage: number;
      confidenceAverage: number;
      improvementRate: number;
      weakPhonemes: string[];
      totalAssessments: number;
      completedExercises: number;
      weeklyProgress: { date: string; score: number }[];
    }>('/progress/dashboard');
    return response.data;
  },
  getProgressHistory: async () => {
    const response = await api.get<ProgressData[]>('/progress/history');
    return response.data;
  }
};

export const exerciseService = {
  getExercises: async () => {
    const response = await api.get<Exercise[]>('/exercise/list');
    return response.data;
  },
  completeExercise: async (exerciseId: number) => {
    const response = await api.put<{ success: boolean; exercise: Exercise }>(`/exercise/complete/${exerciseId}`);
    return response.data;
  },
  generateNewExercises: async () => {
    const response = await api.post<Exercise[]>('/exercise/generate');
    return response.data;
  }
};

export const historyService = {
  getHistory: async () => {
    const response = await api.get<{
      id: number;
      assessment_id: number;
      sentence: string;
      overall_score: number;
      pronunciation_score: number;
      fluency_score: number;
      assessment_date: string;
    }[]>('/history/list');
    return response.data;
  }
};

export const profileService = {
  updateProfile: async (data: { name: string; email: string; target_accent?: string; daily_goal?: number }) => {
    const response = await api.put<User>('/profile/update', data);
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get<{ target_accent: string; daily_goal: number }>('/profile/settings');
    return response.data;
  }
};

export default api;
