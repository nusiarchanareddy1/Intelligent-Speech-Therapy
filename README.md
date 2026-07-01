### Step 1: Database Initialization
### Step 2: Run the NLP Microservice
### Step 3: Run the Backend Service
### Step 4: Run the Frontend App
# Intelligent Speech Therapy Platform

This repository contains a full-stack speech therapy platform (frontend, backend, and an NLP microservice). The project provides tools for pronunciation scoring, phoneme-level analysis, exercise generation, and progress tracking.

## Quick links

- Frontend: `frontend/` (React + Vite + TypeScript)
- Backend: `backend/` (FastAPI + SQLAlchemy)
- NLP microservice: `NLP/` (audio processing and scoring)

## Quickstart (local)

Prerequisites: Python 3.10+, Node.js 18+, Docker (optional)

1. Install backend dependencies and run backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2. Start NLP microservice (in a separate shell):

```bash
cd NLP
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

3. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Open the frontend at `http://localhost:3000`.

## Docker Compose

You can start all services with Docker Compose:

```bash
docker-compose up --build
```

## Tests

Run backend and NLP tests with pytest if present:

```bash
cd backend
pytest

cd ../NLP
pytest
```

## CI

A basic GitHub Actions workflow is provided at `.github/workflows/ci.yml` to run backend tests and build the frontend on pushes and pull requests.

## Contributing

If you want help improving this repo (README, CI, docs), open an issue or a PR.

---

Maintained by the project contributors.

