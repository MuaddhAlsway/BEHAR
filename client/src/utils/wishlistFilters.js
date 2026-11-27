
import {
  WISHLIST_DEFAULT_FILTERS,
  WISHLIST_SORT,
} from "../data/wishlist";

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();
}

function getCourseId(course) {
  return String(course?.id ?? course?._id ?? course?.slug ?? "");
}

function getCoursePrice(course) {
  const price = Number(
    course?.price?.amount ?? course?.price ?? 0
  );

  return Number.isFinite(price) ? price : 0;
}

function getCourseRating(course) {
  const rating = Number(
    course?.rating?.average ?? course?.rating ?? 0
  );

  return Number.isFinite(rating) ? rating : 0;
}

function getLocalizedText(value) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    return [
      value.en,
      value.ar,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

export function resolveWishlistCourses(
  wishlistItems,
  catalog
) {
  if (!Array.isArray(wishlistItems)) return [];

  const courses = Array.isArray(catalog) ? catalog : [];

  const courseMap = new Map(
    courses.map((course) => [getCourseId(course), course])
  );

  return wishlistItems
    .map((item) => {
      const course = courseMap.get(item.courseId);

      if (!course) return null;

      return {
        ...course,
        wishlistCourseId: item.courseId,
        savedAt: item.savedAt,
      };
    })
    .filter(Boolean);
}

export function filterWishlistCourses(
  courses,
  filters = WISHLIST_DEFAULT_FILTERS
) {
  const {
    search = "",
    category = "all",
    level = "all",
    price = "all",
    sort = WISHLIST_SORT.RECENT,
  } = filters;

  const query = normalizeText(search);

  const filtered = courses.filter((course) => {
    const searchable = normalizeText(
      [
        getLocalizedText(course.title),
        getLocalizedText(course.description),
        getLocalizedText(course.instructor?.name),
        getLocalizedText(course.category),
      ].join(" ")
    );

    if (query && !searchable.includes(query)) return false;

    if (
      category !== "all" &&
      normalizeText(course.category?.id ?? course.category) !==
        normalizeText(category)
    ) {
      return false;
    }

    if (
      level !== "all" &&
      normalizeText(course.level) !== normalizeText(level)
    ) {
      return false;
    }

    const coursePrice = getCoursePrice(course);

    if (price === "free" && coursePrice !== 0) return false;
    if (price === "paid" && coursePrice <= 0) return false;

    return true;
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case WISHLIST_SORT.OLDEST:
        return Date.parse(a.savedAt) - Date.parse(b.savedAt);

      case WISHLIST_SORT.RATING:
        return getCourseRating(b) - getCourseRating(a);

      case WISHLIST_SORT.PRICE_LOW:
        return getCoursePrice(a) - getCoursePrice(b);

      case WISHLIST_SORT.PRICE_HIGH:
        return getCoursePrice(b) - getCoursePrice(a);

      case WISHLIST_SORT.RECENT:
      default:
        return Date.parse(b.savedAt) - Date.parse(a.savedAt);
    }
  });
}
