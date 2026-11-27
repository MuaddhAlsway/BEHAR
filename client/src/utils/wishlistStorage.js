
import {
  WISHLIST_STORAGE_KEY,
  WISHLIST_SCHEMA_VERSION,
  normalizeWishlistItems,
} from "../data/wishlist";

export const WISHLIST_STORAGE_STATUS = Object.freeze({
  READY: "ready",
  UNAVAILABLE: "unavailable",
  INVALID: "invalid",
  UNSUPPORTED: "unsupported",
  ERROR: "error",
});

function getStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readWishlistStorage() {
  const storage = getStorage();

  if (!storage) {
    return {
      items: [],
      status: WISHLIST_STORAGE_STATUS.UNAVAILABLE,
      error: "Local storage is unavailable.",
    };
  }

  try {
    const raw = storage.getItem(WISHLIST_STORAGE_KEY);

    if (raw === null) {
      return {
        items: [],
        status: WISHLIST_STORAGE_STATUS.READY,
        error: null,
      };
    }

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        items: [],
        status: WISHLIST_STORAGE_STATUS.INVALID,
        error: "Stored wishlist data is corrupted.",
      };
    }

    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== WISHLIST_SCHEMA_VERSION ||
      !Array.isArray(parsed.items)
    ) {
      return {
        items: [],
        status: WISHLIST_STORAGE_STATUS.UNSUPPORTED,
        error: "Unsupported wishlist storage format.",
      };
    }

    return {
      items: normalizeWishlistItems(parsed.items),
      status: WISHLIST_STORAGE_STATUS.READY,
      error: null,
    };
  } catch {
    return {
      items: [],
      status: WISHLIST_STORAGE_STATUS.ERROR,
      error: "Unable to read wishlist storage.",
    };
  }
}

export function writeWishlistStorage(items) {
  const storage = getStorage();

  if (!storage) {
    return {
      success: false,
      status: WISHLIST_STORAGE_STATUS.UNAVAILABLE,
      error: "Local storage is unavailable.",
    };
  }

  try {
    const payload = {
      version: WISHLIST_SCHEMA_VERSION,
      items: normalizeWishlistItems(items),
    };

    storage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(payload)
    );

    return {
      success: true,
      status: WISHLIST_STORAGE_STATUS.READY,
      error: null,
    };
  } catch {
    return {
      success: false,
      status: WISHLIST_STORAGE_STATUS.ERROR,
      error: "Unable to save wishlist changes.",
    };
  }
}

export function clearWishlistStorage() {
  return writeWishlistStorage([]);
}
