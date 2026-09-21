import os
import hashlib
from PIL import Image

try:
    import imagehash
    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False

# In-memory store of processed image hashes for duplicate detection
seen_hashes = {}

def compute_photo_hash(photo_path: str) -> str:
    """Computes perceptual hash (phash) or fallback MD5 hash of an image."""
    if not os.path.exists(photo_path):
        # Return deterministic hash from string path if file not on disk
        return hashlib.md5(photo_path.encode('utf-8')).hexdigest()[:16]

    try:
        image = Image.open(photo_path)
        if HAS_IMAGEHASH:
            # Perceptual hash (phash) detects visually identical photos even if resized/compressed
            phash = str(imagehash.phash(image))
            return phash
        else:
            # Fallback PIL resize pixel hash
            image = image.resize((8, 8), Image.Resampling.LANCZOS).convert('L')
            pixels = list(image.getdata())
            avg = sum(pixels) / len(pixels)
            bits = "".join(["1" if p > avg else "0" for p in pixels])
            return hex(int(bits, 2))[2:].zfill(16)
    except Exception as e:
        print(f"[DuplicateCheck] Error reading image ({e}), using path hash.")
        return hashlib.md5(photo_path.encode('utf-8')).hexdigest()[:16]

def check_duplicate_image(photo_hash: str, distance_threshold: int = 4) -> bool:
    """Checks if photo_hash matches any previously seen photo hash."""
    if photo_hash in seen_hashes:
        return True

    # Check Hamming distance for perceptual hash comparison
    for existing_hash in seen_hashes.keys():
        try:
            val1 = int(photo_hash, 16)
            val2 = int(existing_hash, 16)
            hamming_dist = bin(val1 ^ val2).count('1')
            if hamming_dist <= distance_threshold:
                return True
        except ValueError:
            if photo_hash == existing_hash:
                return True

    # Register hash
    seen_hashes[photo_hash] = True
    return False
