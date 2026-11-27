
import { useCallback, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ArrowUpRight,
  LoaderCircle,
  ShieldAlert,
} from "lucide-react";

// ==========================================
// WISHLIST CONTEXT
// ==========================================

import { useWishlist } from "../../hooks/useWishlist";

// ==========================================
// WISHLIST COMPONENTS
// ==========================================

import WishlistHeader from "../../components/student/wishlist/WishlistHeader";
import WishlistToolbar from "../../components/student/wishlist/WishlistToolbar";
import WishlistCourseGrid from "../../components/student/wishlist/WishlistCourseGrid";
import WishlistCourseEmpty from "../../components/student/wishlist/WishlistCourseEmpty";
import RemoveWishlistDialog from "../../components/student/wishlist/RemoveWishlistDialog";
import WishlistToast from "../../components/student/wishlist/WishlistToast";

// ==========================================
// WISHLIST DATA
// ==========================================

import {
  WISHLIST_DEFAULT_FILTERS,
  WISHLIST_SORT,
} from "../../data/wishlist";
import { courses as catalogCourses } from "../../data/courses";

// ==========================================
// STYLES
// ==========================================

import "../../styles/student/wishlist.css";

// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {
  en: {
    eyebrow: "YOUR LEARNING COLLECTION",
    collection: "Your collection",
    collectionDescription:
      "Everything you've bookmarked for your learning journey.",
    explore: "Explore courses",
    loading: "Loading your wishlist...",
    unavailable: "Wishlist storage is unavailable.",
    storageNote:
      "Your saved courses are stored in this browser for now.",

    removeSuccess: "Course removed",
    removeSuccessDescription:
      "Your wishlist has been updated successfully.",
    removeError: "Unable to remove course",
    removeErrorDescription:
      "Something went wrong. Please try again.",
  },

  ar: {
    eyebrow: "مجموعتك التعليمية",
    collection: "مجموعتك",
    collectionDescription:
      "كل الدورات التي حفظتها لمتابعة رحلتك التعليمية.",
    explore: "استكشف الدورات",
    loading: "جارٍ تحميل قائمة الرغبات...",
    unavailable: "التخزين المحلي لقائمة الرغبات غير متاح.",
    storageNote:
      "يتم حفظ دوراتك في هذا المتصفح حاليًا.",

    removeSuccess: "تمت إزالة الدورة",
    removeSuccessDescription:
      "تم تحديث قائمة رغباتك بنجاح.",
    removeError: "تعذرت إزالة الدورة",
    removeErrorDescription:
      "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
};

// ==========================================
// HELPERS
// ==========================================

function getCourseTitle(courseId) {
  return String(courseId ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function getLocalizedValue(value, language) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const result =
      value[language] ?? value.en ?? value.ar;

    return typeof result === "string" ? result : "";
  }

  return "";
}

function getCoursePrice(course) {
  const raw =
    course?.price?.amount ?? course?.price;

  if (raw == null || raw === "") {
    return null;
  }

  const price = Number(raw);

  return Number.isFinite(price) && price >= 0
    ? price
    : null;
}

function getCourseRating(course) {
  const raw =
    course?.rating?.average ??
    course?.rating?.value ??
    course?.rating;

  if (raw == null || raw === "") {
    return null;
  }

  const rating = Number(raw);

  return Number.isFinite(rating)
    ? rating
    : null;
}

function getCourseCategory(course) {
  const category =
    course?.category?.id ??
    course?.category?.slug ??
    course?.category;

  return typeof category === "string"
    ? category
    : "";
}

function getCourseLevel(course) {
  return typeof course?.level === "string"
    ? course.level
    : "";
}

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();
}

// ==========================================
// COURSE CATALOG RESOLUTION
// ==========================================

function resolveSavedCourses(wishlistItems, courses) {
  const catalog = Array.isArray(courses)
    ? courses
    : [];

  const courseMap = new Map();

  catalog.forEach((course) => {
    const identifiers = [
      course?.id,
      course?._id,
      course?.slug,
    ];

    identifiers.forEach((identifier) => {
      if (identifier == null) return;

      const key = String(identifier).trim();

      if (key) {
        courseMap.set(key, course);
      }
    });
  });

  return wishlistItems.map((item) => ({
    courseId: item.courseId,
    savedAt: item.savedAt,
    course:
      courseMap.get(String(item.courseId)) ?? null,
  }));
}

// ==========================================
// FILTERING & SORTING
// ==========================================

function filterSavedCourses(items, filters) {
  const query = normalizeSearch(filters.search);

  const filtered = items.filter((item) => {
    const course = item.course;

    const title = course
      ? [
          getLocalizedValue(course.title, "en"),
          getLocalizedValue(course.title, "ar"),
        ].join(" ")
      : getCourseTitle(item.courseId);

    const instructor = course
      ? [
          getLocalizedValue(
            course.instructor?.name ??
              course.instructor,
            "en"
          ),
          getLocalizedValue(
            course.instructor?.name ??
              course.instructor,
            "ar"
          ),
        ].join(" ")
      : "";

    const category = getCourseCategory(course);
    const level = getCourseLevel(course);

    const searchable = normalizeSearch(
      [
        title,
        instructor,
        category,
        level,
        item.courseId,
      ].join(" ")
    );

    if (
      query &&
      !searchable.includes(query)
    ) {
      return false;
    }

    if (
      filters.category !== "all" &&
      normalizeSearch(category) !==
        normalizeSearch(filters.category)
    ) {
      return false;
    }

    if (
      filters.level !== "all" &&
      normalizeSearch(level) !==
        normalizeSearch(filters.level)
    ) {
      return false;
    }

    const price = getCoursePrice(course);

    if (
      filters.price === "free" &&
      price !== 0
    ) {
      return false;
    }

    if (
      filters.price === "paid" &&
      (price === null || price <= 0)
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    const dateA = Date.parse(a.savedAt) || 0;
    const dateB = Date.parse(b.savedAt) || 0;

    switch (filters.sort) {
      case WISHLIST_SORT.OLDEST:
        return dateA - dateB;

      case WISHLIST_SORT.RATING:
        return (
          (getCourseRating(b.course) ?? -1) -
          (getCourseRating(a.course) ?? -1)
        ) || dateB - dateA;

      case WISHLIST_SORT.PRICE_LOW: {
        const priceA = getCoursePrice(a.course);
        const priceB = getCoursePrice(b.course);

        if (priceA === null) {
          return priceB === null ? dateB - dateA : 1;
        }

        if (priceB === null) return -1;

        return priceA - priceB || dateB - dateA;
      }

      case WISHLIST_SORT.PRICE_HIGH: {
        const priceA = getCoursePrice(a.course);
        const priceB = getCoursePrice(b.course);

        if (priceA === null) {
          return priceB === null ? dateB - dateA : 1;
        }

        if (priceB === null) return -1;

        return priceB - priceA || dateB - dateA;
      }

      case WISHLIST_SORT.RECENT:
      default:
        return dateB - dateA;
    }
  });
}

// ==========================================
// MAIN WISHLIST PAGE
// ==========================================

export default function Wishlist({ courses = catalogCourses }) {
  const { pathname } = useLocation();

  const language =
    pathname.split("/")[1] === "ar"
      ? "ar"
      : "en";

  const dictionary = translations[language];

  // ========================================
  // WISHLIST CONTEXT
  // ========================================

  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
    storageError,
    storageWritable,
    hydrated,
  } = useWishlist();

  // ========================================
  // FILTER STATE
  // ========================================

  const [filters, setFilters] = useState({
    ...WISHLIST_DEFAULT_FILTERS,
  });

  const clearFilters = () => {
    setFilters({
      ...WISHLIST_DEFAULT_FILTERS,
    });
  };

  // ========================================
  // REMOVE DIALOG STATE
  // ========================================

  const [pendingRemoval, setPendingRemoval] =
    useState(null);

  const [removing, setRemoving] = useState(false);

  // ========================================
  // TOAST STATE
  // ========================================

  const [toast, setToast] = useState(null);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = (type, title, description) => {
    setToast({
      id: Date.now(),
      type,
      title,
      description,
    });
  };

  // ========================================
  // RESOLVED SAVED COURSES
  // ========================================

  const resolvedCourses = useMemo(
    () =>
      resolveSavedCourses(
        wishlistItems,
        courses
      ),
    [wishlistItems, courses]
  );

  // ========================================
  // FILTERED & SORTED COURSES
  // ========================================

  const filteredCourses = useMemo(
    () =>
      filterSavedCourses(
        resolvedCourses,
        filters
      ),
    [resolvedCourses, filters]
  );

  // ========================================
  // AVAILABLE CATEGORIES
  // ========================================

  const categories = useMemo(() => {
    const values = new Set();

    resolvedCourses.forEach((item) => {
      const category = getCourseCategory(
        item.course
      );

      if (category) {
        values.add(category);
      }
    });

    return [...values].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [resolvedCourses]);

  // ========================================
  // REQUEST COURSE REMOVAL
  // ========================================

  const requestRemove = useCallback(
    (courseId, title) => {
      if (!storageWritable) return;

      setPendingRemoval({
        courseId,
        title: title || getCourseTitle(courseId),
      });
    },
    [storageWritable]
  );

  // ========================================
  // CANCEL COURSE REMOVAL
  // ========================================

  const cancelRemove = useCallback(() => {
    if (removing) return;

    setPendingRemoval(null);
  }, [removing]);

  // ========================================
  // CONFIRM COURSE REMOVAL
  // ========================================

  const confirmRemove = () => {
    if (
      !pendingRemoval ||
      removing ||
      !storageWritable
    ) {
      return;
    }

    setRemoving(true);

    try {
      const result = removeFromWishlist(
        pendingRemoval.courseId
      );

      if (result?.success) {
        setPendingRemoval(null);

        showToast(
          "success",
          dictionary.removeSuccess,
          dictionary.removeSuccessDescription
        );
      } else {
        showToast(
          "error",
          dictionary.removeError,
          typeof result?.error === "string"
            ? result.error
            : dictionary.removeErrorDescription
        );
      }
    } catch (error) {
      console.error(
        "Wishlist removal failed:",
        error
      );

      showToast(
        "error",
        dictionary.removeError,
        dictionary.removeErrorDescription
      );
    } finally {
      setRemoving(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="student-wishlist-page"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ====================================
          WISHLIST HEADER
      ==================================== */}

      <WishlistHeader
        language={language}
        count={wishlistCount}
      />

      {/* ====================================
          PAGE CONTENT
      ==================================== */}

      <div className="student-wishlist-page__content">
        {/* ==================================
            COLLECTION INTRODUCTION
        ================================== */}

        <section className="student-wishlist-page__intro">
          <div>
            <span className="student-wishlist-page__eyebrow">
              {dictionary.eyebrow}
            </span>

            <h2>
              {dictionary.collection}
            </h2>

            <p>
              {dictionary.collectionDescription}
            </p>
          </div>

          <Link
            to={`/${language}/courses`}
            className="student-wishlist-page__explore"
          >
            {dictionary.explore}

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </section>

        {/* ==================================
            HYDRATION / LOADING
        ================================== */}

        {!hydrated ? (
          <div
            className="student-wishlist-page__loading"
            role="status"
          >
            <LoaderCircle
              size={24}
              className="student-wishlist-page__spinner"
              aria-hidden="true"
            />

            {dictionary.loading}
          </div>
        ) : (
          <>
            {/* ================================
                STORAGE ERROR
            ================================ */}

            {storageError && (
              <div
                className="student-wishlist-page__notice"
                role="alert"
              >
                <ShieldAlert
                  size={18}
                  aria-hidden="true"
                />

                <span>
                  {storageError ||
                    dictionary.unavailable}
                </span>
              </div>
            )}

            {/* ================================
                SEARCH / FILTER / SORT
            ================================ */}

            {wishlistCount > 0 && (
              <WishlistToolbar
                language={language}
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                resultCount={
                  filteredCourses.length
                }
                categories={categories}
                disabled={!hydrated}
              />
            )}

            {/* ================================
                WISHLIST CONTENT
            ================================ */}

            {wishlistCount === 0 ? (
              <WishlistCourseEmpty
                language={language}
                variant="empty"
              />
            ) : filteredCourses.length === 0 ? (
              <WishlistCourseEmpty
                language={language}
                variant="filtered"
                onClearFilters={clearFilters}
              />
            ) : (
              <WishlistCourseGrid
                items={filteredCourses}
                language={language}
                onRemove={requestRemove}
                disabled={!storageWritable}
              />
            )}
          </>
        )}

        {/* ==================================
            STORAGE INFORMATION
        ================================== */}

        <p className="student-wishlist-page__storage-note">
          {dictionary.storageNote}
        </p>
      </div>

      {/* ====================================
          REMOVE CONFIRMATION DIALOG
      ==================================== */}

      <RemoveWishlistDialog
        open={Boolean(pendingRemoval)}
        courseTitle={
          pendingRemoval?.title ?? ""
        }
        language={language}
        onCancel={cancelRemove}
        onConfirm={confirmRemove}
        busy={removing}
      />

      {/* ====================================
          TOAST NOTIFICATION
      ==================================== */}

      <WishlistToast
        key={toast?.id ?? "empty"}
        toast={toast}
        onDismiss={dismissToast}
        language={language}
      />
    </div>
  );
}
