# Technical Requirements Document (TRD) — FieldWatch

## 1. Stack
- Backend: Node.js 20+ / Express / Mongoose
- ML Service: Python 3.11 / FastAPI / ImageHash / Pillow
- Frontend: React 18 / Vite / Tailwind CSS / Leaflet / Recharts / i18next

## 2. Weighting Formula
total_weight = w_photo * w_distinctness * w_diversity * w_recency * w_trust
