
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import CourseDiscoveryHero from "../../components/courses/CourseDiscoveryHero";
import DisciplineAtlas from "../../components/courses/DisciplineAtlas";
import CourseFilters from "../../components/courses/CourseFilters";

import { courses } from "../../data/courses";
import { isValidCourseCategory } from "../../data/courseCategories";
import {
  defaultCourseFilters,
  normalizeCourseFilters,
} from "../../data/courseFilterOptions";
import FeaturedCollection from "../../components/courses/FeaturedCollection";

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
      return sorted.sort((a, b) => b.students - a.students);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");

  const selectedCategory =
    categoryParam && isValidCourseCategory(categoryParam)
      ? categoryParam
      : "all";

  const search = searchParams.get("search")?.trim() || "";

  const filters = normalizeCourseFilters(
    Object.fromEntries(
      Object.keys(defaultCourseFilters).map((key) => [
        key,
        searchParams.get(key),
      ])
    )
  );

  const courseCounts = useMemo(() => {
    return courses.reduce((counts, course) => {
      counts[course.category] =
        (counts[course.category] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.toLocaleLowerCase();

    const matches = courses.filter((course) => {
      if (
        selectedCategory !== "all" &&
        course.category !== selectedCategory
      ) {
        return false;
      }

      if (query) {
        const searchable = [
          course.title.en,
          course.title.ar,
          course.instructor,
          course.category,
        ]
          .join(" ")
          .toLocaleLowerCase();

        if (!searchable.includes(query)) return false;
      }

      if (
        filters.level !== "all" &&
        course.level !== filters.level
      ) {
        return false;
      }

      if (filters.price === "free" && course.price !== 0) {
        return false;
      }

      if (filters.price === "paid" && course.price <= 0) {
        return false;
      }

      if (
        filters.language !== "all" &&
        course.language !== filters.language
      ) {
        return false;
      }

      if (!matchesDuration(course.durationHours, filters.duration)) {
        return false;
      }

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

  const updateParams = (updates, resetPage = true) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        Object.entries(updates).forEach(([key, value]) => {
          if (
            value == null ||
            value === "" ||
            value === "all" ||
            (key === "sort" && value === "newest")
          ) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });

        if (resetPage) next.delete("page");

        return next;
      },
      { preventScrollReset: true }
    );
  };

  const handleCategoryChange = (category) => {
    updateParams({ category });

    document.getElementById("catalog")?.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const handleFilterChange = (key, value) => {
    updateParams({ [key]: value });
  };

  const handleReset = () => {
    const updates = Object.fromEntries(
      Object.entries(defaultCourseFilters)
    );

    updateParams(updates);
  };

  const handleSearch = (query) => {
    updateParams({ search: query });

    document.getElementById("catalog")?.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <>
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

      {/* P12.3 — Advanced Filters */}
      <CourseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        resultCount={filteredCourses.length}
      />

      {/* P12.4 / P12.5 — Upcoming Catalog */}
      <section
        id="catalog"
        style={{
          padding: "100px 5%",
          background: "#F4F1E9",
          color: "#102C2B",
          scrollMarginTop: "100px",
        }}
      >
        <h2>Course Catalog</h2>
        <p>
          {filteredCourses.length} matching courses
        </p>

        {/* Upcoming FeaturedCollection */}
          <FeaturedCollection courses={filteredCourses} />
        {/* Upcoming CourseCatalog */}
         <section id="catalog" style={{ scrollMarginTop: 100 }}>
      {/* CourseCatalog will go here */}
        </section>
      </section>
    </>
  );
}
