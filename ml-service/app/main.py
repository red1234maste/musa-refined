from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ClassificationRequest, ClassificationResponse
from app.classifier import is_plant_or_crop_image, classify_crop_pest
from app.duplicate_check import compute_photo_hash, check_duplicate_image

app = FastAPI(
    title="FieldWatch ML Microservice",
    description="Python FastAPI service for image classification, out-of-domain plant gate, and perceptual duplicate hashing",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "FieldWatch ML Microservice"}

@app.post("/classify", response_model=ClassificationResponse)
def classify_endpoint(req: ClassificationRequest):
    try:
        # Step 1: Out-of-domain plant gate check
        is_valid, rejection_reason = is_plant_or_crop_image(req.photo_path)
        if not is_valid:
            return ClassificationResponse(
                is_valid_image=False,
                rejection_reason=rejection_reason,
                confidence=0.1,
                pest_type="Unknown",
                is_duplicate=False,
                photo_hash="0000000000000000"
            )

        # Step 2: Perceptual hash & duplicate check
        photo_hash = compute_photo_hash(req.photo_path)
        is_duplicate = check_duplicate_image(photo_hash)

        # Step 3: Pest & disease classification
        pest_type, confidence = classify_crop_pest(req.photo_path, req.crop_type)

        return ClassificationResponse(
            is_valid_image=True,
            rejection_reason=None,
            confidence=confidence,
            pest_type=pest_type,
            is_duplicate=is_duplicate,
            photo_hash=photo_hash
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
