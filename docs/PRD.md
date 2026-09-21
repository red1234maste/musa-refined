# Product Requirements Document (PRD) — FieldWatch

## 1. Executive Summary
FieldWatch turns scattered farmer crop photos into reliable hyperlocal outbreak intelligence.

## 2. Personas
1. **Farmer (reporter)**: Submits reports via App, PWA, or phone IVR in English, Hindi, or Marathi.
2. **Agronomist (reviewer)**: Confirms/rejects flagged reports via desktop dashboard.
3. **Agriculture Officer (admin)**: Monitors region-wide outbreak clusters and alert logs.

## 3. Goals
- Alert fired within one clustering cycle when 3 distinct fields report an outbreak.
- Post-alert dampening prevents duplicate copycat floods from causing false re-escalations.
- Invalid non-crop photos are rejected with clear translated errors.
