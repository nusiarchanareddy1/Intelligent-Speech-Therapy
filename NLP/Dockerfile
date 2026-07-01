FROM python:3.10-slim

WORKDIR /app

# Install system audio libraries and build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose NLP port
EXPOSE 8001

# Start command
CMD ["uvicorn", "main.app", "--host", "0.0.0.0", "--port", "8001"]
