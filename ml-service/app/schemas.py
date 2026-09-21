from pydantic import BaseModel
from typing import Optional

class ClassificationRequest(BaseModel):
    photo_path: str
    farmer_id: Optional[str] = None
    crop_type: Optional[str] = "Wheat"

class ClassificationResponse(BaseModel):
    is_valid_image: bool
    rejection_reason: Optional[str] = None
    confidence: float
    pest_type: str
    is_duplicate: bool
    photo_hash: str
