
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  WISHLIST_STORAGE_KEY,
  createWishlistEntry,
  normalizeCourseId,
} from "../data/wishlist";

import {
  WISHLIST_STORAGE_STATUS,
  readWishlistStorage,
  writeWishlistStorage,
} from "../utils/wishlistStorage";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [storageStatus, setStorageStatus] = useState(
    WISHLIST_STORAGE_STATUS.READY
  );
  const [storageError, setStorageError] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const result = readWishlistStorage();

    setWishlistItems(result.items);
    setStorageStatus(result.status);
    setStorageError(result.error);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    function handleStorage(event) {
      if (
        event.key !== WISHLIST_STORAGE_KEY &&
        event.key !== null
      ) {
        return;
      }

      const result = readWishlistStorage();

      setWishlistItems(result.items);
      setStorageStatus(result.status);
      setStorageError(result.error);
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const storageWritable =
    hydrated &&
    storageStatus === WISHLIST_STORAGE_STATUS.READY;

  const persistUpdate = useCallback(
    (updater) => {
      if (!hydrated) {
        return {
          success: false,
          error: "Wishlist is still loading.",
        };
      }

      if (storageStatus !== WISHLIST_STORAGE_STATUS.READY) {
        return {
          success: false,
          error: storageError || "Wishlist storage is unavailable.",
        };
      }

      const current = readWishlistStorage();

      if (current.status !== WISHLIST_STORAGE_STATUS.READY) {
        setStorageStatus(current.status);
        setStorageError(current.error);

        return {
          success: false,
          error: current.error,
        };
      }

      const next = updater(current.items);

      const result = writeWishlistStorage(next);

      if (!result.success) {
        setStorageStatus(result.status);
        setStorageError(result.error);

        return result;
      }

      setWishlistItems(next);
      setStorageStatus(result.status);
      setStorageError(null);

      return result;
    },
    [hydrated, storageStatus, storageError]
  );

  const isWishlisted = useCallback(
    (courseId) => {
      const id = normalizeCourseId(courseId);

      if (!id) return false;

      return wishlistItems.some(
        (item) => item.courseId === id
      );
    },
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    (courseId) => {
      const id = normalizeCourseId(courseId);

      if (!id) {
        return {
          success: false,
          error: "Invalid course ID.",
        };
      }

      return persistUpdate((current) => {
        if (current.some((item) => item.courseId === id)) {
          return current;
        }

        return [...current, createWishlistEntry(id)];
      });
    },
    [persistUpdate]
  );

  const removeFromWishlist = useCallback(
    (courseId) => {
      const id = normalizeCourseId(courseId);

      if (!id) {
        return {
          success: false,
          error: "Invalid course ID.",
        };
      }

      return persistUpdate((current) =>
        current.filter((item) => item.courseId !== id)
      );
    },
    [persistUpdate]
  );

  const toggleWishlist = useCallback(
    (courseId) => {
      const id = normalizeCourseId(courseId);

      if (!id) {
        return {
          success: false,
          error: "Invalid course ID.",
        };
      }

      return persistUpdate((current) => {
        const exists = current.some(
          (item) => item.courseId === id
        );

        if (exists) {
          return current.filter(
            (item) => item.courseId !== id
          );
        }

        return [...current, createWishlistEntry(id)];
      });
    },
    [persistUpdate]
  );

  const clearWishlist = useCallback(
    () => persistUpdate(() => []),
    [persistUpdate]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      storageStatus,
      storageError,
      storageWritable,
      hydrated,
    }),
    [
      wishlistItems,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      storageStatus,
      storageError,
      storageWritable,
      hydrated,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
