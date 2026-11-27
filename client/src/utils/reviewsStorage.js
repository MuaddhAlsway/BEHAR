import { REVIEWS_STORAGE_KEY, normalizeReview } from "../data/reviews";

export function readReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return { items: null, error: null };
    const parsed = JSON.parse(raw);
    return { items: Array.isArray(parsed) ? parsed.map(normalizeReview).filter(Boolean) : [], error: null };
  } catch {
    return { items: [], error: "Unable to read saved reviews." };
  }
}

export function writeReviews(items) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(items));
    return { success: true };
  } catch {
    return { success: false, error: "Unable to save reviews." };
  }
}
