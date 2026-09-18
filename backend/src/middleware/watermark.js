const path = require('path');
const fs = require('fs');

let sharp = null;
try {
  sharp = require('sharp');
} catch (err) {
  console.warn('⚠️  sharp not available – watermark disabled');
}

/**
 * Adds a subtle watermark to an image.
 * ALWAYS writes to a DIFFERENT file so we never overwrite the input.
 * Falls back to the original path if anything goes wrong.
 *
 * @param {string} imageUrl - e.g. "/uploads/properties/opt-xyz.webp"
 * @returns {string} public URL of the watermarked image (or original if it failed)
 */
const protectImage = async (imageUrl) => {
  // Normalize the URL → absolute file path
  const cleanPath = imageUrl.replace(/^\/+/, '');
  const absoluteIn = path.join(__dirname, '..', '..', cleanPath);

  // Bail out gracefully if the file doesn't exist or sharp isn't installed
  if (!fs.existsSync(absoluteIn) || !sharp) {
    return imageUrl;
  }

  try {
    const dir = path.dirname(absoluteIn);
    const baseName = path.basename(absoluteIn, path.extname(absoluteIn));

    // ✅ Guarantee a DIFFERENT output name, even for .webp inputs
    const outName = `${baseName}-wm-${Date.now()}.webp`;
    const absoluteOut = path.join(dir, outName);

    // Extra safety: never let in === out
    if (path.resolve(absoluteIn) === path.resolve(absoluteOut)) {
      console.warn('⚠️  protectImage: input and output would be identical, skipping.');
      return imageUrl;
    }

    const watermarkSvg = Buffer.from(`
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" font-family="Arial" font-size="18"
              fill="rgba(255,255,255,0.12)"
              text-anchor="middle" dominant-baseline="middle"
              transform="rotate(-30 200 125)">
          BAOBAB REAL ESTATE
        </text>
      </svg>
    `);

    await sharp(absoluteIn)
      .composite([{ input: watermarkSvg, gravity: 'center', blend: 'over' }])
      .webp({ quality: 82 })
      .toFile(absoluteOut);

    // Now delete the original input (safe — output already written)
    try { fs.unlinkSync(absoluteIn); } catch (_) {}

    // Convert back to a public URL
    const newRelative = path
      .relative(path.join(__dirname, '..', '..'), absoluteOut)
      .replace(/\\/g, '/');

    return '/' + newRelative;
  } catch (error) {
    console.error('⚠️  protectImage failed for', imageUrl, ':', error.message);
    // Return original so the property still gets created
    return imageUrl;
  }
};

module.exports = { protectImage };