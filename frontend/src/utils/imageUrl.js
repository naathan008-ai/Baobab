/**
 * Builds a full image URL from a relative or absolute path.
 *
 * Handles:
 *   - "/uploads/properties/abc.webp"  → "http://localhost:5000/uploads/properties/abc.webp"
 *   - "uploads/properties/abc.webp"   → "http://localhost:5000/uploads/properties/abc.webp"
 *   - "http://cdn.com/abc.webp"       → unchanged
 *   - "https://cdn.com/abc.webp"      → unchanged
 *   - null / undefined / ""           → placeholder
 *   - "blob:..."                      → unchanged (for local previews)
 *   - "data:..."                      → unchanged
 */

const PLACEHOLDER = '/placeholder.jpg';

// Derive the API base (without the trailing /api segment)
const getBackendBase = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const cleaned = apiUrl.replace(/\/+$/, ''); // strip trailing slashes
  return cleaned.replace(/\/api$/, '');       // strip trailing /api
};

const BACKEND_BASE = getBackendBase();

export const getImageUrl = (path) => {
  if (!path) return PLACEHOLDER;

  const str = String(path).trim();
  if (!str) return PLACEHOLDER;

  // Already a full URL
  if (/^https?:\/\//i.test(str)) return str;

  // Blob URLs (local file previews)
  if (str.startsWith('blob:')) return str;

  // Data URIs
  if (str.startsWith('data:')) return str;

  // Relative path → make absolute
  const cleanPath = str.startsWith('/') ? str : `/${str}`;
  return `${BACKEND_BASE}${cleanPath}`;
};

export default getImageUrl;