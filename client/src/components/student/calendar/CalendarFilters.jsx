
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 12
 *
 * CalendarFilters
 *
 * Features:
 * - Search events
 * - Preset filters
 * - Event type filtering
 * - Course filtering
 * - Event sorting
 * - Reset filters
 * - English / Arabic
 * - Responsive design
 * - Accessible form controls
 *
 * Pure CSS — no Tailwind.
 */

import { useId, useMemo, useState } from "react";

import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_FILTERS,
  CALENDAR_EVENT_META,
  CALENDAR_DEMO_COURSES,
} from "../../../data/calendar";

import {
  CALENDAR_SORT,
} from "../../../utils/calendarFilters";

import "../../../styles/student/calendar/calendar-filters.css";

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    search: "Search events",
    searchPlaceholder: "Search your calendar...",
    clearSearch: "Clear search",
    filters: "Filters",
    all: "All events",
    academic: "Academic",
    personal: "Personal",
    liveSessions: "Live sessions",
    assignments: "Assignments",
    assessments: "Assessments",
    eventType: "Event type",
    allTypes: "All event types",
    course: "Course",
    allCourses: "All courses",
    sort: "Sort by",
    reset: "Reset filters",
    advanced: "More filters",
    hideAdvanced: "Hide filters",
    activeFilters: "Active filters",
    results: "matching events",
    noResults: "No matching events",
    startAsc: "Date: earliest first",
    startDesc: "Date: latest first",
    titleAsc: "Title: A to Z",
    titleDesc: "Title: Z to A",
    typeAsc: "Event type",
    priorityDesc: "Highest priority",
    unknownCourse: "Other course",
  },

  ar: {
    search: "البحث في الفعاليات",
    searchPlaceholder: "ابحث في التقويم...",
    clearSearch: "مسح البحث",
    filters: "التصفية",
    all: "جميع الفعاليات",
    academic: "أكاديمي",
    personal: "شخصي",
    liveSessions: "الجلسات المباشرة",
    assignments: "الواجبات",
    assessments: "الاختبارات",
    eventType: "نوع الفعالية",
    allTypes: "جميع الأنواع",
    course: "الدورة",
    allCourses: "جميع الدورات",
    sort: "الترتيب حسب",
    reset: "إعادة ضبط التصفية",
    advanced: "خيارات تصفية إضافية",
    hideAdvanced: "إخفاء خيارات التصفية",
    activeFilters: "التصفيات النشطة",
    results: "فعالية مطابقة",
    noResults: "لا توجد فعاليات مطابقة",
    startAsc: "التاريخ: الأقدم أولاً",
    startDesc: "التاريخ: الأحدث أولاً",
    titleAsc: "العنوان: تصاعدي",
    titleDesc: "العنوان: تنازلي",
    typeAsc: "نوع الفعالية",
    priorityDesc: "الأولوية الأعلى",
    unknownCourse: "دورة أخرى",
  },
};

// ------------------------------------------------------------
// Preset filters
// ------------------------------------------------------------

const PRESET_FILTERS = [
  {
    value: CALENDAR_FILTERS.ALL,
    labelKey: "all",
  },
  {
    value: CALENDAR_FILTERS.ACADEMIC,
    labelKey: "academic",
  },
  {
    value: CALENDAR_FILTERS.PERSONAL,
    labelKey: "personal",
  },
  {
    value: CALENDAR_FILTERS.LIVE_SESSIONS,
    labelKey: "liveSessions",
  },
  {
    value: CALENDAR_FILTERS.ASSIGNMENTS,
    labelKey: "assignments",
  },
  {
    value: CALENDAR_FILTERS.ASSESSMENTS,
    labelKey: "assessments",
  },
];

const SORT_OPTIONS = [
  {
    value: CALENDAR_SORT.START_ASC,
    labelKey: "startAsc",
  },
  {
    value: CALENDAR_SORT.START_DESC,
    labelKey: "startDesc",
  },
  {
    value: CALENDAR_SORT.TITLE_ASC,
    labelKey: "titleAsc",
  },
  {
    value: CALENDAR_SORT.TITLE_DESC,
    labelKey: "titleDesc",
  },
  {
    value: CALENDAR_SORT.TYPE_ASC,
    labelKey: "typeAsc",
  },
  {
    value: CALENDAR_SORT.PRIORITY_DESC,
    labelKey: "priorityDesc",
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getLocalizedValue(value, language) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[language] ||
    value.en ||
    value.ar ||
    ""
  );
}

function getEventTypeLabel(type, language) {
  const meta = CALENDAR_EVENT_META[type];

  if (!meta) {
    return type.replaceAll("_", " ");
  }

  return (
    getLocalizedValue(meta.label, language) ||
    getLocalizedValue(meta.name, language) ||
    type.replaceAll("_", " ")
  );
}

function getCourseLabel(course, language) {
  if (!course) return "";

  if (typeof course === "string") {
    const demoCourse = Array.isArray(
      CALENDAR_DEMO_COURSES
    )
      ? CALENDAR_DEMO_COURSES.find(
          (item) => item.id === course
        )
      : null;

    return demoCourse
      ? getCourseLabel(demoCourse, language)
      : course;
  }

  return (
    (language === "ar"
      ? course.titleAr || course.nameAr
      : course.title || course.name) ||
    course.title ||
    course.name ||
    course.id ||
    ""
  );
}

function getCount(counts, filter) {
  if (!counts || typeof counts !== "object") {
    return null;
  }

  const value = counts[filter];

  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function CalendarFilters({
  className = "",
}) {
  const {
    language,
    filters,
    filteredEvents,
    filterCounts,
    availableCourses,
    availableTypes,
    filtersActive,
    updateFilters,
    setCalendarSearch,
    clearFilters,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const [advancedOpen, setAdvancedOpen] =
    useState(false);

  const searchId = useId();
  const typeId = useId();
  const courseId = useId();
  const sortId = useId();
  const advancedId = useId();

  const activePreset =
    filters.filter || CALENDAR_FILTERS.ALL;

  const searchValue = filters.search || "";

  const selectedType = filters.types?.[0] || "";
  const selectedCourse = filters.courseIds?.[0] || "";

  const sortValue =
    filters.sort || CALENDAR_SORT.START_ASC;

  // ----------------------------------------------------------
  // Normalize available types
  // ----------------------------------------------------------

  const typeOptions = useMemo(() => {
    if (!Array.isArray(availableTypes)) {
      return [];
    }

    return availableTypes
      .map((item) => {
        const value =
          typeof item === "string"
            ? item
            : item?.type || item?.value;

        if (!value || typeof value !== "string") {
          return null;
        }

        return {
          value,
          label: getEventTypeLabel(value, language),
        };
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.label.localeCompare(b.label, language)
      );
  }, [availableTypes, language]);

  // ----------------------------------------------------------
  // Normalize available courses
  // ----------------------------------------------------------

  const courseOptions = useMemo(() => {
    if (!Array.isArray(availableCourses)) {
      return [];
    }

    return availableCourses
      .map((item) => {
        const value =
          typeof item === "string"
            ? item
            : item?.id || item?.courseId;

        if (!value || typeof value !== "string") {
          return null;
        }

        return {
          value,
          label:
            getCourseLabel(item, language) ||
            getCourseLabel(value, language) ||
            t.unknownCourse,
        };
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.label.localeCompare(b.label, language)
      );
  }, [availableCourses, language, t.unknownCourse]);

  const resultCount = Array.isArray(filteredEvents)
    ? filteredEvents.length
    : 0;

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------

  const handlePresetChange = (value) => {
    updateFilters({ filter: value });
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;

    updateFilters({
      types: value ? [value] : null,
    });
  };

  const handleCourseChange = (event) => {
    const value = event.target.value;

    updateFilters({
      courseIds: value ? [value] : null,
    });
  };

  const handleSortChange = (event) => {
    updateFilters({
      sort: event.target.value,
    });
  };

  const handleSearchChange = (event) => {
    setCalendarSearch(event.target.value);
  };

  const handleReset = () => {
    clearFilters();
  };

  const rootClassName = [
    "behar-calendar-filters",
    isArabic
      ? "behar-calendar-filters--rtl"
      : "behar-calendar-filters--ltr",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <section
      className={rootClassName}
      aria-label={t.filters}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ======================================
          SEARCH AND FILTER ACTIONS
      ====================================== */}

      <div className="behar-calendar-filters__top">
        <div className="behar-calendar-filters__search">
          <label
            className="behar-calendar-filters__sr-only"
            htmlFor={searchId}
          >
            {t.search}
          </label>

          <Search
            className="behar-calendar-filters__search-icon"
            size={18}
            aria-hidden="true"
          />

          <input
            id={searchId}
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            maxLength={200}
          />

          {searchValue && (
            <button
              type="button"
              className="behar-calendar-filters__clear-search"
              onClick={() => setCalendarSearch("")}
              aria-label={t.clearSearch}
              title={t.clearSearch}
            >
              <X
                size={16}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <div className="behar-calendar-filters__actions">
          <button
            type="button"
            className={[
              "behar-calendar-filters__advanced-button",
              advancedOpen
                ? "behar-calendar-filters__advanced-button--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-expanded={advancedOpen}
            aria-controls={advancedId}
            onClick={() =>
              setAdvancedOpen((current) => !current)
            }
          >
            <SlidersHorizontal
              size={16}
              aria-hidden="true"
            />

            <span>
              {advancedOpen
                ? t.hideAdvanced
                : t.advanced}
            </span>

            <ChevronDown
              size={15}
              aria-hidden="true"
              className={
                advancedOpen
                  ? "behar-calendar-filters__chevron--open"
                  : ""
              }
            />
          </button>

          {filtersActive && (
            <button
              type="button"
              className="behar-calendar-filters__reset"
              onClick={handleReset}
              title={t.reset}
            >
              <RotateCcw
                size={15}
                aria-hidden="true"
              />

              <span>{t.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================
          PRESET FILTER CHIPS
      ====================================== */}

      <div
        className="behar-calendar-filters__presets"
        role="group"
        aria-label={t.filters}
      >
        {PRESET_FILTERS.map((option) => {
          const active =
            activePreset === option.value;

          const count = getCount(
            filterCounts,
            option.value
          );

          return (
            <button
              key={option.value}
              type="button"
              className={[
                "behar-calendar-filters__preset",
                active
                  ? "behar-calendar-filters__preset--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={active}
              onClick={() =>
                handlePresetChange(option.value)
              }
            >
              <span>{t[option.labelKey]}</span>

              {count !== null && (
                <span className="behar-calendar-filters__preset-count">
                  {count.toLocaleString(
                    isArabic ? "ar-SA" : "en-US"
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================
          ADVANCED FILTERS
      ====================================== */}

      <div
        id={advancedId}
        className={[
          "behar-calendar-filters__advanced",
          advancedOpen
            ? "behar-calendar-filters__advanced--open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        hidden={!advancedOpen}
      >
        {/* Event type */}

        <div className="behar-calendar-filters__field">
          <label htmlFor={typeId}>
            {t.eventType}
          </label>

          <div className="behar-calendar-filters__select-wrap">
            <BookOpen
              size={16}
              aria-hidden="true"
            />

            <select
              id={typeId}
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="">
                {t.allTypes}
              </option>

              {typeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Course */}

        <div className="behar-calendar-filters__field">
          <label htmlFor={courseId}>
            {t.course}
          </label>

          <div className="behar-calendar-filters__select-wrap">
            <BookOpen
              size={16}
              aria-hidden="true"
            />

            <select
              id={courseId}
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">
                {t.allCourses}
              </option>

              {courseOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Sort */}

        <div className="behar-calendar-filters__field">
          <label htmlFor={sortId}>
            {t.sort}
          </label>

          <div className="behar-calendar-filters__select-wrap">
            <ArrowUpDown
              size={16}
              aria-hidden="true"
            />

            <select
              id={sortId}
              value={sortValue}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {t[option.labelKey]}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ======================================
          RESULTS SUMMARY
      ====================================== */}

      <div
        className="behar-calendar-filters__summary"
        role="status"
        aria-live="polite"
      >
        <span>
          {resultCount === 0
            ? t.noResults
            : `${resultCount.toLocaleString(
                isArabic ? "ar-SA" : "en-US"
              )} ${t.results}`}
        </span>

        {filtersActive && (
          <span className="behar-calendar-filters__active-indicator">
            <span
              className="behar-calendar-filters__active-dot"
              aria-hidden="true"
            />

            {t.activeFilters}
          </span>
        )}
      </div>
    </section>
  );
}
