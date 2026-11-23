
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import CourseDiscoveryHero from "../../components/courses/CourseDiscoveryHero";
import DisciplineAtlas from "../../components/courses/DisciplineAtlas";
import CourseFilters from "../../components/courses/CourseFilters";
import FeaturedCollection from "../../components/courses/FeaturedCollection";
import CourseCatalog from "../../components/courses/CourseCatalog";

import { courses } from "../../data/courses";
import { isValidCourseCategory } from "../../data/courseCategories";

import {
  defaultCourseFilters,
  normalizeCourseFilters,
} from "../../data/courseFilterOptions";

/* ==========================================
   HELPERS
========================================== */

function matchesDuration(hours, duration) {
  switch (duration) {
    case "under-2":
      return hours < 2;

    case "2-5":
      return hours >= 2 && hours < 5;

    case "5-10":
      return hours >= 5 && hours < 10;

    case "10-plus":
      return hours >= 10;

    default:
      return true;
  }
}

function sortCourses(items, sort) {
  const sorted = [...items];

  switch (sort) {
    case "popular":
      return sorted.sort(
        (a, b) => b.students - a.students
      );

    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating
      );

    case "price-low":
      return sorted.sort(
        (a, b) => a.price - b.price
      );

    case "price-high":
      return sorted.sort(
        (a, b) => b.price - a.price
      );

    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
  }
}

/* ==========================================
   COURSES PAGE
========================================== */

export default function Courses() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  /* ==========================================
     URL STATE
  ========================================== */

  const categoryParam =
    searchParams.get("category");

  const selectedCategory =
    categoryParam &&
    isValidCourseCategory(categoryParam)
      ? categoryParam
      : "all";

  const search =
    searchParams.get("search")?.trim() || "";

  const filters = normalizeCourseFilters(
    Object.fromEntries(
      Object.keys(defaultCourseFilters).map(
        (key) => [
          key,
          searchParams.get(key),
        ]
      )
    )
  );

  /* ==========================================
     CATEGORY COUNTS
  ========================================== */

  const courseCounts = useMemo(() => {
    return courses.reduce((counts, course) => {
      counts[course.category] =
        (counts[course.category] || 0) + 1;

      return counts;
    }, {});
  }, []);

  /* ==========================================
     FILTER + SORT COURSES
  ========================================== */

  const filteredCourses = useMemo(() => {
    const query = search.toLocaleLowerCase();

    const matches = courses.filter((course) => {
      // Category
      if (
        selectedCategory !== "all" &&
        course.category !== selectedCategory
      ) {
        return false;
      }

      // Search
      if (query) {
        const searchable = [
          typeof course.title === "string"
            ? course.title
            : course.title?.en,
          course.title?.ar,
          course.instructor,
          course.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      // Level
      if (
        filters.level !== "all" &&
        course.level !== filters.level
      ) {
        return false;
      }

      // Price
      if (
        filters.price === "free" &&
        course.price !== 0
      ) {
        return false;
      }

      if (
        filters.price === "paid" &&
        course.price <= 0
      ) {
        return false;
      }

      // Language
      if (
        filters.language !== "all" &&
        course.language !== filters.language
      ) {
        return false;
      }

      // Duration
      if (
        !matchesDuration(
          course.durationHours,
          filters.duration
        )
      ) {
        return false;
      }

      // Rating
      if (
        filters.rating !== "all" &&
        course.rating < Number(filters.rating)
      ) {
        return false;
      }

      return true;
    });

    return sortCourses(matches, filters.sort);
  }, [
    selectedCategory,
    search,
    filters.level,
    filters.price,
    filters.language,
    filters.duration,
    filters.rating,
    filters.sort,
  ]);

  /* ==========================================
     URL PARAMETER UPDATES
  ========================================== */

  const updateParams = (
    updates,
    resetPage = true
  ) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(
          previous
        );

        Object.entries(updates).forEach(
          ([key, value]) => {
            if (
              value == null ||
              value === "" ||
              value === "all" ||
              (key === "sort" &&
                value === "newest")
            ) {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }
        );

        if (resetPage) {
          next.delete("page");
        }

        return next;
      },
      {
        preventScrollReset: true,
      }
    );
  };

  /* ==========================================
     SCROLL TO CATALOG
  ========================================== */

  const scrollToCatalog = () => {
    document
      .getElementById("catalog")
      ?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  };

  /* ==========================================
     EVENT HANDLERS
  ========================================== */

  const handleCategoryChange = (category) => {
    updateParams({ category });
    scrollToCatalog();
  };

  const handleFilterChange = (key, value) => {
    updateParams({
      [key]: value,
    });
  };

  const handleSearch = (query) => {
    updateParams({
      search: query,
    });

    scrollToCatalog();
  };

  const handleReset = () => {
    updateParams({
      ...defaultCourseFilters,
    });
  };

  const handleClearAllFilters = () => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(
          previous
        );

        [
          "search",
          "category",
          "level",
          "price",
          "language",
          "duration",
          "rating",
          "sort",
          "page",
        ].forEach((key) => {
          next.delete(key);
        });

        return next;
      },
      {
        preventScrollReset: true,
      }
    );
  };

  /* ==========================================
     PAGE RENDER
  ========================================== */

  return (
    <main className="behar-courses-page">

      {/* P12.1 — Course Discovery Hero */}
      <CourseDiscoveryHero
        courseCount={courses.length}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {/* P12.2 — Discipline Atlas */}
      <DisciplineAtlas
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        courseCounts={courseCounts}
      />

      {/* P12.3 — Advanced Course Filters */}
      <CourseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        resultCount={filteredCourses.length}
      />

      {/* P12.4 — Featured Collection */}
      <FeaturedCollection />

      {/* P12.5 — The Learning Archive */}
      <CourseCatalog
        courses={filteredCourses}
        onResetFilters={handleClearAllFilters}
      />

    </main>
  );
}
