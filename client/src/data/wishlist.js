
export const WISHLIST_STORAGE_KEY = "behar:wishlist:v1";
export const WISHLIST_SCHEMA_VERSION = 1;

export const WISHLIST_SORT = Object.freeze({
  RECENT: "recent",
  OLDEST: "oldest",
  RATING: "rating",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
});

export const WISHLIST_DEFAULT_FILTERS = Object.freeze({
  search: "",
  category: "all",
  level: "all",
  price: "all",
  sort: WISHLIST_SORT.RECENT,
});

export function normalizeCourseId(value) {
  if (typeof value !== "string") return null;

  const id = value.trim();

  if (!id || id.length > 200) return null;

  return id;
}

export function normalizeWishlistEntry(value) {
  if (!value || typeof value !== "object") return null;

  const courseId = normalizeCourseId(value.courseId);
  const timestamp = Date.parse(value.savedAt);

  if (!courseId || !Number.isFinite(timestamp)) return null;

  return {
    courseId,
    savedAt: new Date(timestamp).toISOString(),
  };
}

export function normalizeWishlistItems(items) {
  if (!Array.isArray(items)) return [];

  const unique = new Map();

  for (const item of items) {
    const normalized = normalizeWishlistEntry(item);

    if (!normalized) continue;

    const existing = unique.get(normalized.courseId);

    if (
      !existing ||
      normalized.savedAt < existing.savedAt
    ) {
      unique.set(normalized.courseId, normalized);
    }
  }

  return [...unique.values()];
}

export function createWishlistEntry(courseId) {
  const normalizedId = normalizeCourseId(courseId);

  if (!normalizedId) {
    throw new Error("Invalid wishlist course ID.");
  }

  return {
    courseId: normalizedId,
    savedAt: new Date().toISOString(),
  };
}
