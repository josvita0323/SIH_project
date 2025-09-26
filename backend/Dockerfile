# syntax=docker/dockerfile:1.4
FROM python:3.12-slim AS base

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

COPY backend/requirements.txt /app/requirements.txt
RUN apt-get update && apt-get install -y tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/requirements.txt .

# cache pip packages between builds
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

COPY backend ./backend

WORKDIR /app/backend
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
