
import { useId } from "react";
import { LayoutGrid } from "lucide-react";

import EnrolledCourseCard from "./EnrolledCourseCard";
import LearningEmptyState from "./LearningEmptyState";

import "../../../styles/student/my-learning/enrolled-courses-grid.css";

const translations = {
  en: {
    eyebrow: "YOUR ENROLLED COURSES",
    heading: "Your learning library",
    description:
      "Everything you've enrolled in, all in one place.",
    courses: "Courses",
    showing: "Showing",
    of: "of",
    searchResults: "Filtered course results",
  },

  ar: {
    eyebrow: "دوراتك المسجلة",
    heading: "مكتبتك التعليمية",
    description:
      "جميع الدورات التي سجلت فيها، في مكان واحد.",
    courses: "الدورات",
    showing: "عرض",
    of: "من",
    searchResults: "نتائج تصفية الدورات",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

export default function EnrolledCoursesGrid({
  courses = [],
  totalCourses = 0,
  language = "en",
  searchQuery = "",
  activeStatus = "all",
  isLoading = false,
  error = null,
  onResetFilters,
  onClearSearch,
  onRetry,
  onOpenCourse,
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];
  const headingId = useId();

  const hasCourses = totalCourses > 0;
  const hasResults = courses.length > 0;

  const hasSearch = searchQuery.trim().length > 0;

  let emptyType = "empty";

  if (hasCourses && hasSearch) {
    emptyType = "search";
  } else if (
    hasCourses &&
    activeStatus !== "all"
  ) {
    emptyType = "filter";
  }

  const handleReset = () => {
    if (emptyType === "search") {
      onClearSearch?.();
    } else {
      onResetFilters?.();
    }
  };

  return (
    <section
      className="behar-courses-grid"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby={headingId}
    >
      {/* SECTION HEADER */}
      <div className="behar-courses-grid__header">
        <div className="behar-courses-grid__header-copy">
          <span className="behar-courses-grid__eyebrow">
            <span />
            {t.eyebrow}
          </span>

          <h2 id={headingId}>{t.heading}</h2>

          <p>{t.description}</p>
        </div>

        <div className="behar-courses-grid__count">
          <LayoutGrid
            size={17}
            strokeWidth={1.6}
            aria-hidden="true"
          />

          <span>
            {t.showing}{" "}
            <strong>
              {formatNumber(courses.length, locale)}
            </strong>{" "}
            {t.of}{" "}
            <strong>
              {formatNumber(totalCourses, locale)}
            </strong>
          </span>
        </div>
      </div>

      {/* COURSE COLLECTION */}
      {isLoading ? (
        <LearningEmptyState
          type="loading"
          language={locale}
        />
      ) : error ? (
        <LearningEmptyState
          type="error"
          language={locale}
          onRetry={onRetry}
        />
      ) : hasResults ? (
        <div
          className="behar-courses-grid__list"
          aria-label={t.searchResults}
        >
          {courses.map((course) => (
            <EnrolledCourseCard
              key={course.courseId || course.id}
              course={course}
              language={locale}
              onOpenCourse={onOpenCourse}
            />
          ))}
        </div>
      ) : (
        <LearningEmptyState
          type={emptyType}
          language={locale}
          onReset={handleReset}
        />
      )}

      {/* SECTION FOOTER */}
      {!isLoading && !error && hasResults && (
        <div className="behar-courses-grid__footer">
          <span>BEHAR / EDUCATION</span>

          <span>
            {formatNumber(courses.length, locale)}{" "}
            {t.courses}
          </span>
        </div>
      )}
    </section>
  );
}
