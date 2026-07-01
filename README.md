<<<<<<< HEAD
# Intelligent-Speech-Therapy
=======
# Intelligent Speech Therapy Platform with Adaptive Exercises and Progress Tracking

LuminaSpeech is a complete, production-ready, full-stack speech therapy application that evaluates spoken English pronunciation down to the individual phoneme level, provides real-time visualization of speech waves, generates adaptive recovery exercises, and logs historical progress stats.

---

## 🏗️ Architecture Overview

The system is split into three decoupled services, containerized and ran side-by-side:

```
[React/Vite Frontend] (Client UI)
       │ (Axios requests / uploads)
       ▼
[FastAPI Backend] ─── (SQLAlchemy ORM) ─── [SQLite database (speech_therapy.db)]
       │ (JSON payload)
       ▼
[FastAPI NLP Engine] ─── [OpenAI Whisper & Librosa Speech Models]
```

1. **Frontend**: A React.js single-page application bundled with Vite, TypeScript, and Tailwind CSS.
2. **Backend**: A FastAPI server connected to a local SQLite database using SQLAlchemy. Manages security authentication (JWT) and historical database transactions.
3. **NLP Module**: A standalone microservice handling noise reduction, silence removal, pitch tracking, speech rate evaluation, forced phonetic alignment, scoring ratios, and therapy drill generation.

---

## 📁 Folder Structure

```
Speech-Therapy-Platform/
│
├── frontend/                  # React Vite Client
│   ├── src/
│   │   ├── assets/            # Global images & icons
│   │   ├── components/        # Sidebar, SpeechRecorder, PhonemeTable, ProgressChart...
│   │   ├── context/           # AuthContext (JWT & Dark Mode)
│   │   ├── pages/             # Home, Login, Dashboard, Assessment, Results, Profile...
│   │   ├── services/          # api.ts (Central HTTP Client)
│   │   ├── utils/             # Math & cleaning helpers
│   │   ├── App.tsx            # Routes configurations
│   │   └── main.tsx           # Boostrap script
│   ├── package.json
│   ├── Dockerfile
│   ├── vercel.json
│   └── tailwind.config.js
│
├── backend/                   # FastAPI Web Server
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── routes/            # auth.py, speech.py, assessment.py, progress.py...
│   │   ├── utils/             # auth_utils.py (JWT verify / bcrypt hash)
│   │   ├── database.py        # SQLite connectivity setup
│   │   ├── seed.py            # Automatic clinical db seeder
│   │   └── main.py            # FastAPI main entrypoint
│   ├── tests/                 # Unit tests (pytest client tests)
│   ├── requirements.txt
│   └── Dockerfile
│
└── NLP/                       # FastAPI NLP / Audio Microservice
    ├── audio_processing.py    # Noise gates, MFCC features, pitch trackers
    ├── phoneme_alignment.py   # CMU Dictionary phonetic mapping & forced alignment
    ├── speech_scoring.py      # Pronunciation, Fluency, Confidence & Grammar scores
    ├── feedback_generator.py  # Articulation tips compiler
    ├── exercise_generator.py  # Clinical exercises generator
    ├── recommendation_engine.py# Focus areas generator
    ├── main.py                # FastAPI main entrypoint
    ├── tests/                 # Unit tests (pytest nlp tests)
    ├── requirements.txt
    └── Dockerfile
```

---

## 🛠️ Installation & Local Setup

Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### Step 1: Database Initialization
The SQLite database file `speech_therapy.db` is automatically created and seeded with default clinical user profiles on backend server startup. No manual configuration is required.

### Step 2: Run the NLP Microservice
1. Navigate to the `NLP` directory:
   ```bash
   cd NLP
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the service on port 8001:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

### Step 3: Run the Backend Service
1. Navigate to the `backend` directory:
   ```bash
   cd ../backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the service on port 8000:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Step 4: Run the Frontend App
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Launch development server on port 3000:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`.

---

## 🐳 Running with Docker Compose

To spin up all services instantly under a single network bridge:
1. Navigate to the root directory containing `docker-compose.yml`:
   ```bash
   docker-compose up --build
   ```
2. The services will bind to:
   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8000`
   - **NLP API**: `http://localhost:8001`

---

## 🚀 Live Demo Accounts

For immediate clinical testing of the dashboard widgets and graphs:
- **Email**: `therapist@luminaspeech.com`
- **Password**: `therapy123`

---

## 🧪 Testing Guide

Verify correct functionality of API routes and phonetic parsing algorithms.

### Backend Tests
Execute pytest inside the `backend` folder:
```bash
cd backend
pytest
```

### NLP Tests
Execute pytest inside the `NLP` folder:
```bash
cd NLP
pytest
```

---

## 🌐 Deployment Configuration

### 1. Frontend (Vercel)
- Set Framework preset to **Vite**.
- Set Output directory to **dist**.
- The included `vercel.json` handles URL rewrites to direct API requests to the Render backend domain.

### 2. Backend (Render)
- Deploy as a **Web Service**.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add environment variables: `NLP_SERVICE_URL` (points to the deployed NLP URL).

### 3. NLP Service (Railway / Render)
- Deploy as a **Web Service**.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
>>>>>>> 50dc0cc (Initial commit: add Intelligent Speech Therapy full-stack application)
