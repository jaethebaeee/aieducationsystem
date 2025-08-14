#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:5000}

echo "[smoke] Health"
curl -sf "$BASE_URL/health" | jq . || { echo "health failed"; exit 1; }

echo "[smoke] Readiness"
curl -s "$BASE_URL/ready" | jq . || { echo "ready failed"; exit 1; }

echo "[smoke] AI status"
curl -s "$BASE_URL/ai/status" | jq . || true

echo "[smoke] RAG ingest"
curl -sS -X POST "$BASE_URL/api/rag/ingest" -H 'Content-Type: application/json' -d '{"docs":[{"id":"smoke1","title":"Policy","text":"Admissions policy text","type":"policy","school":"TestU"}]}' | jq . || true

echo "[smoke] RAG search"
curl -sS -X POST "$BASE_URL/api/rag/search" -H 'Content-Type: application/json' -d '{"query":"policy"}' | jq . || true

echo "[smoke] RAG insights"
curl -sS -X POST "$BASE_URL/api/rag/insights" -H 'Content-Type: application/json' -d '{"query":"Summarize TestU policy"}' | jq . || true

echo "[smoke] OK"

