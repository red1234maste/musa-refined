const fs = require('fs');

/**
 * Validates uploaded files by magic bytes (not just extension).
 * Supports JPEG (FF D8 FF), PNG (89 50 4E 47), WebP (52 49 46 46).
 */
function validateImageMagicBytes(req, res, next) {
  if (!req.file) {
    return next(); // photo is optional or simulated via body
  }

  const filePath = req.file.path;
  if (!fs.existsSync(filePath)) {
    return next();
  }

  const buffer = Buffer.alloc(8);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);

  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // 'RIFF'

  if (!isJpeg && !isPng && !isWebp) {
    // Delete invalid file
    try { fs.unlinkSync(filePath); } catch (e) {}
    return res.status(400).json({
      error: 'Invalid file type: File header does not match valid image magic bytes (JPEG/PNG/WebP required).',
      code: 'INVALID_MAGIC_BYTES'
    });
  }

  next();
}

module.exports = { validateImageMagicBytes };
