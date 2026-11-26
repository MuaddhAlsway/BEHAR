
import { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  CalendarDays,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import "../../../styles/student/assignments/assignment-filters.css";

const translations = {
  en: {
    search: "Search assignments",
    searchPlaceholder: "Search by assignment or course...",
    filters: "Filters",
    course: "Course",
    allCourses: "All courses",
    status: "Status",
    allStatuses: "All statuses",
    pending: "Pending",
    submitted: "Submitted",
    underReview: "Under review",
    graded: "Graded",
    deadline: "Deadline",
    allDeadlines: "All deadlines",
    overdue: "Overdue",
    next7Days: "Next 7 days",
    next30Days: "Next 30 days",
    sort: "Sort by",
    nearest: "Nearest deadline",
    latest: "Latest deadline",
    alphabetical: "Alphabetical",
    results: "assignments found",
    oneResult: "assignment found",
    reset: "Reset filters",
    clearSearch: "Clear search",
  },
  ar: {
    search: "البحث عن الواجبات",
    searchPlaceholder: "ابحث باسم الواجب أو الدورة...",
    filters: "التصفية",
    course: "الدورة",
    allCourses: "جميع الدورات",
    status: "الحالة",
    allStatuses: "جميع الحالات",
    pending: "بانتظار التسليم",
    submitted: "تم التسليم",
    underReview: "قيد المراجعة",
    graded: "تم التقييم",
    deadline: "موعد التسليم",
    allDeadlines: "جميع المواعيد",
    overdue: "متأخرة",
    next7Days: "خلال 7 أيام",
    next30Days: "خلال 30 يوماً",
    sort: "الترتيب",
    nearest: "الأقرب موعداً",
    latest: "الأبعد موعداً",
    alphabetical: "أبجدياً",
    results: "واجبات",
    oneResult: "واجب",
    reset: "إعادة ضبط الفلاتر",
    clearSearch: "مسح البحث",
  },
};

export const DEFAULT_ASSIGNMENT_FILTERS = {
  query: "",
  courseId: "all",
  status: "all",
  deadline: "all",
  sort: "nearest",
};

function localized(value, locale) {
  if (typeof value === "string") return value;

  return value?.[locale] ?? value?.en ?? "";
}

export function getAssignmentDeadline(value) {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function filterAssignments(
  assignments = [],
  courses = [],
  filters = DEFAULT_ASSIGNMENT_FILTERS,
  locale = "en",
  now = new Date()
) {
  const courseMap = new Map(
    courses.map((course) => [
      String(course.id),
      course,
    ])
  );

  const search = (filters.query ?? "")
    .trim()
    .toLocaleLowerCase();

  const currentTime = now.getTime();

  const next7Days = new Date(now);
  next7Days.setDate(next7Days.getDate() + 7);

  const next30Days = new Date(now);
  next30Days.setDate(next30Days.getDate() + 30);

  return assignments
    .filter((assignment) => {
      const course = courseMap.get(
        String(assignment.courseId)
      );

      const searchable = [
        localized(assignment.title, "en"),
        localized(assignment.title, "ar"),
        localized(course?.title, "en"),
        localized(course?.title, "ar"),
      ]
        .join(" ")
        .toLocaleLowerCase();

      if (search && !searchable.includes(search)) {
        return false;
      }

      if (
        filters.courseId !== "all" &&
        String(assignment.courseId) !==
          String(filters.courseId)
      ) {
        return false;
      }

      if (
        filters.status !== "all" &&
        assignment.status !== filters.status
      ) {
        return false;
      }

      const deadline = getAssignmentDeadline(
        assignment.dueDate
      );

      if (filters.deadline !== "all") {
        if (!deadline) return false;

        const dueTime = deadline.getTime();

        if (
          filters.deadline === "overdue" &&
          (dueTime >= currentTime ||
            assignment.status !== "pending")
        ) {
          return false;
        }

        if (
          filters.deadline === "next7" &&
          (dueTime < currentTime ||
            dueTime > next7Days.getTime())
        ) {
          return false;
        }

        if (
          filters.deadline === "next30" &&
          (dueTime < currentTime ||
            dueTime > next30Days.getTime())
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "alphabetical") {
        return localized(a.title, locale).localeCompare(
          localized(b.title, locale),
          locale === "ar" ? "ar" : "en"
        );
      }

      const aTime =
        getAssignmentDeadline(a.dueDate)?.getTime() ??
        Number.POSITIVE_INFINITY;

      const bTime =
        getAssignmentDeadline(b.dueDate)?.getTime() ??
        Number.POSITIVE_INFINITY;

      if (filters.sort === "latest") {
        return (
          (Number.isFinite(bTime)
            ? bTime
            : Number.NEGATIVE_INFINITY) -
          (Number.isFinite(aTime)
            ? aTime
            : Number.NEGATIVE_INFINITY)
        );
      }

      return aTime - bTime;
    });
}

export default function AssignmentFilters({
  language = "en",
  courses = [],
  filters = DEFAULT_ASSIGNMENT_FILTERS,
  onChange,
  onReset,
  resultCount = 0,
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.query !== "" ||
    filters.courseId !== "all" ||
    filters.status !== "all" ||
    filters.deadline !== "all" ||
    filters.sort !== "nearest";

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        value: String(course.id),
        label: localized(course.title, locale),
      })),
    [courses, locale]
  );

  function updateFilter(key, value) {
    onChange?.({
      ...filters,
      [key]: value,
    });
  }

  function resetFilters() {
    if (onReset) {
      onReset();
    } else {
      onChange?.({
        ...DEFAULT_ASSIGNMENT_FILTERS,
      });
    }
  }

  return (
    <section
      className="behar-assignment-filters"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.filters}
    >
      <div className="behar-assignment-filters__toolbar">
        <div className="behar-assignment-filters__search">
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            aria-label={t.search}
            placeholder={t.searchPlaceholder}
            value={filters.query}
            onChange={(event) =>
              updateFilter("query", event.target.value)
            }
          />

          {filters.query && (
            <button
              type="button"
              className="behar-assignment-filters__clear"
              aria-label={t.clearSearch}
              onClick={() => updateFilter("query", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`behar-assignment-filters__mobile-toggle ${
            mobileOpen ? "is-active" : ""
          }`}
          aria-expanded={mobileOpen}
          aria-controls="assignment-filter-controls"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <SlidersHorizontal size={18} />
          {t.filters}
          <ChevronDown size={15} />
        </button>
      </div>

      <div
        id="assignment-filter-controls"
        className={`behar-assignment-filters__controls ${
          mobileOpen ? "is-open" : ""
        }`}
      >
        <div className="behar-assignment-filters__field">
          <label htmlFor="assignment-filter-course">
            {t.course}
          </label>

          <div className="behar-assignment-filters__select">
            <select
              id="assignment-filter-course"
              value={filters.courseId}
              onChange={(event) =>
                updateFilter("courseId", event.target.value)
              }
            >
              <option value="all">{t.allCourses}</option>

              {courseOptions.map((course) => (
                <option
                  key={course.value}
                  value={course.value}
                >
                  {course.label}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="behar-assignment-filters__field">
          <label htmlFor="assignment-filter-status">
            {t.status}
          </label>

          <div className="behar-assignment-filters__select">
            <select
              id="assignment-filter-status"
              value={filters.status}
              onChange={(event) =>
                updateFilter("status", event.target.value)
              }
            >
              <option value="all">{t.allStatuses}</option>
              <option value="pending">{t.pending}</option>
              <option value="submitted">
                {t.submitted}
              </option>
              <option value="under_review">
                {t.underReview}
              </option>
              <option value="graded">{t.graded}</option>
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="behar-assignment-filters__field">
          <label htmlFor="assignment-filter-deadline">
            {t.deadline}
          </label>

          <div className="behar-assignment-filters__select">
            <CalendarDays size={15} />

            <select
              id="assignment-filter-deadline"
              value={filters.deadline}
              onChange={(event) =>
                updateFilter(
                  "deadline",
                  event.target.value
                )
              }
            >
              <option value="all">
                {t.allDeadlines}
              </option>
              <option value="overdue">
                {t.overdue}
              </option>
              <option value="next7">
                {t.next7Days}
              </option>
              <option value="next30">
                {t.next30Days}
              </option>
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="behar-assignment-filters__field">
          <label htmlFor="assignment-filter-sort">
            {t.sort}
          </label>

          <div className="behar-assignment-filters__select">
            <ArrowDownAZ size={15} />

            <select
              id="assignment-filter-sort"
              value={filters.sort}
              onChange={(event) =>
                updateFilter("sort", event.target.value)
              }
            >
              <option value="nearest">
                {t.nearest}
              </option>
              <option value="latest">{t.latest}</option>
              <option value="alphabetical">
                {t.alphabetical}
              </option>
            </select>

            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      <div className="behar-assignment-filters__footer">
        <p
          className="behar-assignment-filters__count"
          aria-live="polite"
        >
          <strong>{resultCount}</strong>{" "}
          {resultCount === 1
            ? t.oneResult
            : t.results}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            className="behar-assignment-filters__reset"
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
        )}
      </div>
    </section>
  );
}
