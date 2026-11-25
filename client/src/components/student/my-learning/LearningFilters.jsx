
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDownWideNarrow,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import "../../../styles/student/my-learning/learning-filters.css";

const translations = {
  en: {
    eyebrow: "YOUR COURSE LIBRARY",
    heading: "Explore your learning",
    description:
      "Find the right course and pick up where you left off.",
    courses: "courses",
    course: "course",
    all: "All courses",
    in_progress: "In progress",
    completed: "Completed",
    not_started: "Not started",
    searchPlaceholder: "Search courses, topics, instructors...",
    searchLabel: "Search enrolled courses",
    clearSearch: "Clear search",
    sortLabel: "Sort courses",
    sortBy: "Sort by",
    recent: "Recently accessed",
    progress: "Highest progress",
    title: "Course title A–Z",
    oldest: "Oldest enrolled",
    newest: "Newest enrolled",
    results: "Showing",
    of: "of",
    clearFilters: "Clear filters",
    filterLabel: "Course status",
    noResults: "No matching courses",
    filters: "Filters",
  },
  ar: {
    eyebrow: "مكتبتك التعليمية",
    heading: "استكشف رحلتك التعليمية",
    description:
      "اعثر على الدورة المناسبة وأكمل من حيث توقفت.",
    courses: "دورات",
    course: "دورة",
    all: "جميع الدورات",
    in_progress: "قيد التقدم",
    completed: "مكتملة",
    not_started: "لم تبدأ",
    searchPlaceholder: "ابحث عن دورة أو موضوع أو مدرب...",
    searchLabel: "البحث في الدورات المسجلة",
    clearSearch: "مسح البحث",
    sortLabel: "ترتيب الدورات",
    sortBy: "ترتيب حسب",
    recent: "آخر وصول",
    progress: "الأعلى تقدمًا",
    title: "اسم الدورة",
    oldest: "الأقدم تسجيلًا",
    newest: "الأحدث تسجيلًا",
    results: "عرض",
    of: "من",
    clearFilters: "إعادة ضبط التصفية",
    filterLabel: "حالة الدورة",
    noResults: "لا توجد دورات مطابقة",
    filters: "التصفية",
  },
};

const statusOptions = [
  { value: "all", icon: BookOpen },
  { value: "in_progress", icon: CirclePlay },
  { value: "completed", icon: CheckCircle2 },
  { value: "not_started", icon: RotateCcw },
];

const sortOptions = [
  "recent",
  "progress",
  "title",
  "newest",
  "oldest",
];

function getDocumentLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function useLanguage() {
  const [language, setLanguage] = useState(getDocumentLanguage);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(getDocumentLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

export default function LearningFilters({
  courses = [],
  searchQuery = "",
  onSearchChange,
  activeStatus = "all",
  onStatusChange,
  sortBy = "recent",
  onSortChange,
  resultsCount = 0,
}) {
  const language = useLanguage();
  const t = translations[language];
  const searchId = useId();
  const sortId = useId();
  const tabsId = useId();
  const searchRef = useRef(null);

  const counts = {
    all: courses.length,
    in_progress: courses.filter(
      (course) => course.status === "in_progress"
    ).length,
    completed: courses.filter(
      (course) => course.status === "completed"
    ).length,
    not_started: courses.filter(
      (course) => course.status === "not_started"
    ).length,
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeStatus !== "all" ||
    sortBy !== "recent";

  const resetFilters = () => {
    onSearchChange?.("");
    onStatusChange?.("all");
    onSortChange?.("recent");
  };

  const clearSearch = () => {
    onSearchChange?.("");
    searchRef.current?.focus();
  };

  return (
    <section
      className="behar-learning-filters"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-learning-filters-title"
    >
      <div className="behar-learning-filters__heading">
        <div className="behar-learning-filters__heading-copy">
          <span className="behar-learning-filters__eyebrow">
            <span className="behar-learning-filters__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2 id="behar-learning-filters-title">
            {t.heading}
          </h2>

          <p>{t.description}</p>
        </div>

        <div className="behar-learning-filters__total">
          <strong>
            {formatNumber(courses.length, language)}
          </strong>
          <span>
            {courses.length === 1 ? t.course : t.courses}
          </span>
        </div>
      </div>

      <div className="behar-learning-filters__workspace">
        {/* STATUS FILTERS */}
        <div
          className="behar-learning-filters__tabs"
          role="group"
          aria-label={t.filterLabel}
          id={tabsId}
        >
          {statusOptions.map(({ value, icon: Icon }) => {
            const selected = activeStatus === value;

            return (
              <button
                key={value}
                type="button"
                className={`behar-learning-filters__tab ${
                  selected ? "is-active" : ""
                }`}
                onClick={() => onStatusChange?.(value)}
                aria-pressed={selected}
              >
                <Icon
                  size={15}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <span>{t[value]}</span>

                <span className="behar-learning-filters__tab-count">
                  {formatNumber(counts[value], language)}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH + SORT */}
        <div className="behar-learning-filters__toolbar">
          <div className="behar-learning-filters__search">
            <label
              htmlFor={searchId}
              className="behar-learning-filters__sr-only"
            >
              {t.searchLabel}
            </label>

            <Search
              size={19}
              strokeWidth={1.7}
              aria-hidden="true"
              className="behar-learning-filters__search-icon"
            />

            <input
              ref={searchRef}
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(event) =>
                onSearchChange?.(event.target.value)
              }
              placeholder={t.searchPlaceholder}
              autoComplete="off"
            />

            {searchQuery && (
              <button
                type="button"
                className="behar-learning-filters__clear-search"
                onClick={clearSearch}
                aria-label={t.clearSearch}
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="behar-learning-filters__sort">
            <ArrowDownWideNarrow
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <label htmlFor={sortId}>
              {t.sortBy}
            </label>

            <select
              id={sortId}
              value={sortBy}
              onChange={(event) =>
                onSortChange?.(event.target.value)
              }
              aria-label={t.sortLabel}
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {t[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RESULTS FOOTER */}
        <div className="behar-learning-filters__results">
          <div className="behar-learning-filters__results-count">
            <SlidersHorizontal
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span aria-live="polite" aria-atomic="true">
              {t.results}{" "}
              <strong>
                {formatNumber(resultsCount, language)}
              </strong>{" "}
              {t.of}{" "}
              <strong>
                {formatNumber(courses.length, language)}
              </strong>{" "}
              {t.courses}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="behar-learning-filters__reset"
              onClick={resetFilters}
            >
              <RotateCcw size={14} />
              {t.clearFilters}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
