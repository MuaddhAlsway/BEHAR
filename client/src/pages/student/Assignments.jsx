
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search,
  Send,
} from "lucide-react";

import { courses } from "../../data/courses";
import AssignmentDetails from "./AssignmentDetails";
import "../../styles/student/assignments.css";

const STORAGE_KEY = "behar:student-assignments:v1";

const baseAssignments = [
  {
    id: "assignment-001",
    title: {
      en: "Build a reusable component",
      ar: "بناء مكوّن قابل لإعادة الاستخدام",
    },
    courseId: "course-001",
    instructor: "Omar Khalid",
    dueDate: "2026-12-02",
    status: "pending",
    points: 100,
    description: {
      en: "Create a reusable React component with clear props and accessible states.",
      ar: "أنشئ مكوّناً قابلاً لإعادة الاستخدام مع خصائص واضحة وحالات سهلة الوصول.",
    },
  },
  {
    id: "assignment-002",
    title: {
      en: "Visual identity moodboard",
      ar: "لوحة إلهام للهوية البصرية",
    },
    courseId: "course-002",
    instructor: "Nora Alharbi",
    dueDate: "2026-11-28",
    status: "submitted",
    points: 80,
    description: {
      en: "Translate a brand direction into a focused visual moodboard.",
      ar: "حوّل توجه العلامة التجارية إلى لوحة إلهام بصرية مركزة.",
    },
  },
  {
    id: "assignment-003",
    title: {
      en: "Marketing campaign brief",
      ar: "موجز حملة تسويقية",
    },
    courseId: "course-005",
    instructor: "Layla Haddad",
    dueDate: "2026-11-20",
    status: "graded",
    points: 100,
    grade: "92 / 100",
    description: {
      en: "Write a concise campaign brief with audience, message, and channels.",
      ar: "اكتب موجزاً لحملة يتضمن الجمهور والرسالة والقنوات.",
    },
  },
  {
    id: "assignment-004",
    title: {
      en: "AI creative workflow",
      ar: "سير عمل إبداعي بالذكاء الاصطناعي",
    },
    courseId: "course-004",
    instructor: "Youssef Salem",
    dueDate: "2026-12-10",
    status: "pending",
    points: 120,
    description: {
      en: "Map a responsible AI workflow for a creative project.",
      ar: "صمّم سير عمل مسؤولاً للذكاء الاصطناعي في مشروع إبداعي.",
    },
  },
];

const copy = {
  en: {
    eyebrow: "STUDENT WORKSPACE / ASSIGNMENTS",
    title: "Work that moves you forward.",
    intro:
      "Keep every brief, submission, and result in one focused place.",
    total: "Total",
    pending: "Pending",
    submitted: "Submitted",
    graded: "Graded",
    search: "Search assignments",
    all: "All courses",
    allStatus: "All status",
    grade: "Grade",
    points: "Points",
    due: "Due",
    instructor: "Instructor",
    empty: "No assignments match your filters.",
    reset: "Reset filters",
    details: "View details",
    overview: "Assignment overview",
    statuses: {
      pending: "Pending",
      submitted: "Submitted",
      graded: "Graded",
    },
  },
  ar: {
    eyebrow: "مساحة الطالب / الواجبات",
    title: "عمل يدفعك إلى الأمام.",
    intro:
      "احتفظ بكل مهمة وتسليم ونتيجة في مساحة مركزة واحدة.",
    total: "الإجمالي",
    pending: "قيد الانتظار",
    submitted: "تم التسليم",
    graded: "تم التقييم",
    search: "ابحث في الواجبات",
    all: "كل الدورات",
    allStatus: "كل الحالات",
    grade: "النتيجة",
    points: "درجة",
    due: "موعد التسليم",
    instructor: "المدرب",
    empty: "لا توجد واجبات مطابقة للفلاتر.",
    reset: "إعادة ضبط",
    details: "عرض التفاصيل",
    overview: "ملخص الواجبات",
    statuses: {
      pending: "قيد الانتظار",
      submitted: "تم التسليم",
      graded: "تم التقييم",
    },
  },
};

function getLanguage() {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

function text(value, locale) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[locale] || value?.en || "";
}

function loadSubmissions() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    return saved &&
      typeof saved === "object" &&
      !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function formatDate(value, locale) {
  if (!value) return "—";

  // Parse date-only strings as local calendar dates.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
    }
  ).format(date);
}

export default function Assignments() {
  const [locale, setLocale] = useState(getLanguage);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [submissions, setSubmissions] = useState(
    loadSubmissions
  );
  const [selectedId, setSelectedId] = useState(null);

  const t = copy[locale];

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLocale(getLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // Read updates written from another browser tab.
  useEffect(() => {
    function handleStorage(event) {
      if (
        event.key === STORAGE_KEY ||
        event.key === null
      ) {
        setSubmissions(loadSubmissions());
      }
    }

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const assignments = useMemo(() => {
    return baseAssignments.map((item) => {
      const saved = submissions[item.id];

      // A student cannot overwrite graded records.
      if (
        item.status === "graded" ||
        !saved ||
        typeof saved !== "object"
      ) {
        return item;
      }

      if (
        saved.status !== "submitted" ||
        typeof saved.note !== "string" ||
        !saved.note.trim()
      ) {
        return item;
      }

      return {
        ...item,
        status: "submitted",
        note: saved.note,
        projectUrl:
          typeof saved.projectUrl === "string"
            ? saved.projectUrl
            : "",
        submittedAt:
          typeof saved.submittedAt === "string"
            ? saved.submittedAt
            : null,
      };
    });
  }, [submissions]);

  const courseById = useMemo(() => {
    return new Map(
      courses.map((course) => [
        String(course.id),
        course,
      ])
    );
  }, []);

  const filtered = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();

    return assignments.filter((item) => {
      const course = courseById.get(
        String(item.courseId)
      );

      const haystack = [
        text(item.title, "en"),
        text(item.title, "ar"),
        text(course?.title, "en"),
        text(course?.title, "ar"),
        text(item.instructor, "en"),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (status === "all" ||
          item.status === status) &&
        (courseFilter === "all" ||
          item.courseId === courseFilter) &&
        haystack.includes(searchQuery)
      );
    });
  }, [
    assignments,
    courseById,
    courseFilter,
    query,
    status,
  ]);

  const counts = useMemo(() => {
    return {
      total: assignments.length,
      pending: assignments.filter(
        (item) => item.status === "pending"
      ).length,
      submitted: assignments.filter(
        (item) => item.status === "submitted"
      ).length,
      graded: assignments.filter(
        (item) => item.status === "graded"
      ).length,
    };
  }, [assignments]);

  const selectedAssignment = useMemo(() => {
    return (
      assignments.find(
        (item) => item.id === selectedId
      ) || null
    );
  }, [assignments, selectedId]);

  function openDetails(item) {
    setSelectedId(item.id);
  }

  function closeDetails() {
    setSelectedId(null);
  }

  function saveSubmission(
    assignmentId,
    submission
  ) {
    const assignment = assignments.find(
      (item) => item.id === assignmentId
    );

    // Frontend-only protection against repeated
    // submissions and modifications to graded work.
    if (
      !assignment ||
      assignment.status !== "pending"
    ) {
      return;
    }

    if (
      typeof submission?.text !== "string" ||
      !submission.text.trim()
    ) {
      return;
    }

    const next = {
      ...loadSubmissions(),
      [assignmentId]: {
        status: "submitted",
        note: submission.text.trim(),
        projectUrl:
          typeof submission.link === "string"
            ? submission.link.trim()
            : "",
        submittedAt: new Date().toISOString(),
      },
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // Keep the current session working even
      // if browser storage is unavailable.
    }

    setSubmissions(next);
    closeDetails();
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setCourseFilter("all");
  }

  return (
    <main
      className="behar-assignments"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <header className="behar-assignments__hero">
        <span className="behar-assignments__eyebrow">
          <span />
          {t.eyebrow}
        </span>

        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </header>

      <section
        className="behar-assignments__stats"
        aria-label={t.overview}
      >
        {[
          ["total", ClipboardList],
          ["pending", Clock3],
          ["submitted", Send],
          ["graded", CheckCircle2],
        ].map(([key, Icon]) => {
          const filterValue =
            key === "total" ? "all" : key;

          return (
            <button
              type="button"
              key={key}
              className={
                status === filterValue
                  ? "is-active"
                  : ""
              }
              aria-pressed={
                status === filterValue
              }
              onClick={() =>
                setStatus(filterValue)
              }
            >
              <Icon size={18} />
              <span>{t[key]}</span>
              <strong>{counts[key]}</strong>
            </button>
          );
        })}
      </section>

      <section className="behar-assignments__toolbar">
        <label>
          <Search size={17} />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder={t.search}
            aria-label={t.search}
          />
        </label>

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
          aria-label={t.all}
        >
          <option value="all">{t.all}</option>

          {courses.map((course) => (
            <option
              key={course.id}
              value={course.id}
            >
              {text(course.title, locale)}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          aria-label={t.allStatus}
        >
          <option value="all">
            {t.allStatus}
          </option>

          {Object.keys(t.statuses).map(
            (key) => (
              <option
                key={key}
                value={key}
              >
                {t.statuses[key]}
              </option>
            )
          )}
        </select>
      </section>

      <section
        className="behar-assignments__list"
        aria-live="polite"
      >
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const course = courseById.get(
              String(item.courseId)
            );

            return (
              <article
                className="behar-assignment-card"
                key={item.id}
              >
                <div className="behar-assignment-card__top">
                  <span
                    className={`behar-assignment-card__status is-${item.status}`}
                  >
                    {t.statuses[item.status]}
                  </span>

                  <span>
                    {item.points} {t.points}
                  </span>
                </div>

                <h2>
                  {text(item.title, locale)}
                </h2>

                <p>
                  {text(course?.title, locale)}
                </p>

                <div className="behar-assignment-card__meta">
                  <span>
                    <CalendarDays size={14} />
                    {t.due}:{" "}
                    {formatDate(
                      item.dueDate,
                      locale
                    )}
                  </span>

                  <span>
                    {t.instructor}:{" "}
                    {text(
                      item.instructor,
                      locale
                    )}
                  </span>
                </div>

                <div className="behar-assignment-card__bottom">
                  {item.grade && (
                    <strong>
                      {t.grade}: {item.grade}
                    </strong>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      openDetails(item)
                    }
                  >
                    {t.details}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="behar-assignments__empty">
            <ClipboardList size={28} />

            <p>{t.empty}</p>

            <button
              type="button"
              onClick={resetFilters}
            >
              {t.reset}
            </button>
          </div>
        )}
      </section>

      {selectedAssignment && (
        <AssignmentDetails
          assignment={selectedAssignment}
          course={courseById.get(
            String(selectedAssignment.courseId)
          )}
          language={locale}
          onClose={closeDetails}
          onSubmit={saveSubmission}
        />
      )}
    </main>
  );
}
