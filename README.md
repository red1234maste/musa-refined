# FieldWatch — Hyperlocal Pest & Outbreak Mapping Platform

FieldWatch turns scattered, noisy farmer photo reports into reliable, hyperlocal pest/disease outbreak intelligence — distinguishing real multi-field outbreaks from panic-driven copycat reports, and reaching farmers whether or not they own a smartphone.

---

## 🌟 Key Features
- **Multi-Channel Report Ingestion**: Smartphone app, mobile PWA offline queue with auto-GPS, and 24x7 phone-in IVR call simulator.
- **Python ML Microservice**: Out-of-domain plant vision gate (rejects non-plant photos like shoes or cars) + perceptual hashing (`imagehash`) for copycat duplicate detection.
- **Transparent Multi-Factor Weighting Engine**:
  $$\text{total\_weight} = w_{\text{photo}} \times w_{\text{distinctness}} \times w_{\text{diversity}} \times w_{\text{recency}} \times w_{\text{trust}}$$
- **Spatial Outbreak Clustering & Dampening**:
  - Automatically triggers multi-channel SMS/WhatsApp/IVR alerts when **≥ 3 distinct fields** report the same outbreak.
  - Dampening suppresses copycat floods after an alert has fired.
- **Trilingual Localization**: Full support for English (`en`), Hindi (`hi`), and Marathi (`mr`).
- **Interactive Agronomist Dashboard**: GIS Leaflet maps with layer toggles, priority queue with inline confirm/reject, live weight visualizers, and farmer trust score management.

---

## 🚀 Quick Start

### 1. Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev
```
Runs at: `http://localhost:5000` (Includes `mongodb-memory-server` out of the box!)

### 2. Python ML Microservice (FastAPI)
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
Runs at: `http://localhost:8000`

### 3. Frontend Dashboard & PWA (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:3000`

---

## 🧪 Running Unit Tests
```bash
cd backend
npm test
```

---

## 📑 Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌────────────────────┐
│   Farmer     │     │   Farmer      │     │      Farmer         │
│ (App/PWA)    │     │ (IVR call)    │     │ (Missed call)       │
└──────┬───────┘     └──────┬────────┘     └──────────┬──────────┘
       │ photo+GPS          │ voice/keypad             │ triggers callback
       ▼                    ▼                          ▼
┌──────────────────────────────────────────────────────────────┐
│                Node.js / Express Backend (REST API)            │
│   auth · report ingestion · IVR session state · alert engine   │
└──────┬───────────────────────────────────────────┬────────────┘
       │ POST /classify                             │
       ▼                                             ▼
┌──────────────────────┐                  ┌──────────────────────┐
│ Python FastAPI ML svc │                  │      MongoDB         │
│ classify + dedupe     │◄────results──────┤ reports/clusters/    │
└──────────────────────┘                  │ farmers/alert_log    │
                                            └──────────────────────┘
```
