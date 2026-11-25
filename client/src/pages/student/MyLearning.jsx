
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";

import {
  mockMyLearningStudent,
  mockEnrolledCourses,
} from "../../data/student/myLearning";

// P14.2 — My Learning Components
import MyLearningHero from "../../components/student/my-learning/MyLearningHero";
import LearningFilters from "../../components/student/my-learning/LearningFilters";
import EnrolledCoursesGrid from "../../components/student/my-learning/EnrolledCoursesGrid";
import LearningCollections from "../../components/student/my-learning/LearningCollections";
import DashboardPopup from "../../components/student/dashboard/DashboardPopup";

// Styles
import "../../styles/student/my-learning/my-learning.css";

const translations = {
  en: {
    pageTitle: "My Learning",
    pageDescription:
      "Your personal space for everything you're learning.",
    foundation: "MY LEARNING / FOUNDATION",
    continueLearning: "Continue learning",
    startLearning: "Start learning",
    learningWorkspace: "YOUR LEARNING WORKSPACE",
    resumeTitle: "Pick up where you left off.",
    resumeDescription:
      "Your next lesson is ready. Continue your learning journey.",
  },

  ar: {
    pageTitle: "تعلّمي",
    pageDescription: "مساحتك الشخصية لكل ما تتعلمه.",
    foundation: "مساحة التعلّم / الأساس",
    continueLearning: "متابعة التعلّم",
    startLearning: "ابدأ التعلّم",
    learningWorkspace: "مساحة التعلّم الخاصة بك",
    resumeTitle: "أكمل من حيث توقفت.",
    resumeDescription:
      "درسك القادم جاهز. تابع رحلتك التعليمية.",
  },
};

function getCurrentLanguage() {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

function localized(value, language) {
  if (typeof value === "string") return value;

  return value?.[language] || value?.en || "";
}

function getCourseLearningPath(course) {
  return `/student/learn/${encodeURIComponent(course.slug)}`;
}

export default function MyLearning() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [language, setLanguage] = useState(
    getCurrentLanguage
  );

  // Temporary mock data until backend integration.
  const courses = mockEnrolledCourses;

  useEffect(() => {
    const shouldOpen =
      sessionStorage.getItem(
        "behar:open-my-learning-popup"
      ) === "true" || location.state?.openMyLearning;

    if (!shouldOpen) return undefined;

    sessionStorage.removeItem(
      "behar:open-my-learning-popup"
    );
    setShowSummaryPopup(true);
    navigate(location.pathname, {
      replace: true,
      state: {},
    });

    return undefined;
  }, [location.pathname, location.state, navigate]);

  // Filtering and sorting state.
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Synchronize with document language.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      setLanguage(getCurrentLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  const t = translations[language];

  // Find the most recently accessed course.
  const continueCourse = useMemo(() => {
    const availableCourses = courses.filter(
      (course) =>
        course.slug &&
        course.status !== "completed"
    );

    if (availableCourses.length === 0) {
      return null;
    }

    return [...availableCourses].sort((a, b) => {
      const dateA = new Date(
        a.lastAccessedAt || a.enrolledAt || 0
      ).getTime();

      const dateB = new Date(
        b.lastAccessedAt || b.enrolledAt || 0
      ).getTime();

      return dateB - dateA;
    })[0];
  }, [courses]);

  // Filter and sort enrolled courses.
  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = courses.filter((course) => {
      const matchesStatus =
        activeStatus === "all" ||
        course.status === activeStatus;

      const searchableText = [
        localized(course.title, "en"),
        localized(course.title, "ar"),
        localized(course.category, "en"),
        localized(course.category, "ar"),
        course.instructor?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "progress") {
        return (b.progress || 0) - (a.progress || 0);
      }

      if (sortBy === "title") {
        return localized(a.title, language).localeCompare(
          localized(b.title, language),
          language
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(b.enrolledAt).getTime() -
          new Date(a.enrolledAt).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.enrolledAt).getTime() -
          new Date(b.enrolledAt).getTime()
        );
      }

      // Default: recently accessed.
      return (
        new Date(
          b.lastAccessedAt || b.enrolledAt
        ).getTime() -
        new Date(
          a.lastAccessedAt || a.enrolledAt
        ).getTime()
      );
    });
  }, [
    courses,
    searchQuery,
    activeStatus,
    sortBy,
    language,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveStatus("all");
    setSortBy("recent");
  };

  return (
    <main
      className="behar-my-learning"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ==================================
          PAGE HEADING
      ================================== */}
      <div className="behar-my-learning__page-heading">
        <span className="behar-my-learning__eyebrow">
          <span />
          {t.foundation}
        </span>

        <h1>{t.pageTitle}</h1>
        <p>{t.pageDescription}</p>
      </div>

      {/* ==================================
          P14.2.1 — MY LEARNING HERO
      ================================== */}
      <MyLearningHero
        student={mockMyLearningStudent}
        courses={courses}
      />

      {/* ==================================
          P14.3 — CONTINUE LEARNING CTA
      ================================== */}
      {continueCourse && (
        <section
          className="behar-my-learning__resume"
          aria-label={t.learningWorkspace}
          style={{
            marginBlock: "32px",
            padding: "clamp(24px, 4vw, 40px)",
            background: "#102C2B",
            color: "#F4F1E9",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <span
              style={{
                display: "block",
                marginBottom: "14px",
                color: "#D9EF74",
                fontSize: "11px",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              {t.learningWorkspace}
            </span>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.15,
                fontWeight: 500,
              }}
            >
              {t.resumeTitle}
            </h2>

            <p
              style={{
                margin: "0 0 14px",
                color: "#A8C0B5",
                lineHeight: 1.7,
              }}
            >
              {t.resumeDescription}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {localized(continueCourse.title, language)}
            </p>
          </div>

          <Link
            to={getCourseLearningPath(continueCourse)}
            className="behar-my-learning__resume-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "15px 22px",
              minHeight: "50px",
              borderRadius: "999px",
              background: "#D9EF74",
              color: "#102C2B",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <Play
              size={17}
              fill="currentColor"
              aria-hidden="true"
            />

            {continueCourse.progress > 0
              ? t.continueLearning
              : t.startLearning}

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </section>
      )}

      {/* ==================================
          P14.2.2 — LEARNING FILTERS
      ================================== */}
      <LearningFilters
        courses={courses}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultsCount={filteredCourses.length}
      />

      {/* ==================================
          P14.2.3 + P14.2.4 + P14.2.6
          ENROLLED COURSES + EMPTY STATES
      ================================== */}
      <EnrolledCoursesGrid
        courses={filteredCourses}
        totalCourses={courses.length}
        language={language}
        searchQuery={searchQuery}
        activeStatus={activeStatus}
        onClearSearch={() => setSearchQuery("")}
        onResetFilters={resetFilters}
      />

      {/* ==================================
          P14.2.5 — LEARNING COLLECTIONS
      ================================== */}
      <LearningCollections
        courses={courses}
        language={language}
      />
      {showSummaryPopup && (
        <DashboardPopup
          type="courses"
          data={courses}
          language={language}
          onClose={() => setShowSummaryPopup(false)}
        />
      )}
    </main>
  );
}
