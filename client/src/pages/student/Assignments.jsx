
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Send,
} from "lucide-react";

import { courses } from "../../data/courses";
import AssignmentDetails from "../../components/student/assignments/AssignmentDetails";
import {
  ASSIGNMENT_STORAGE_KEY,
  ASSIGNMENTS_UPDATED_EVENT,
  baseAssignments,
  mergeAssignmentSubmissions,
  readAssignmentSubmissions,
  saveAssignmentSubmission,
} from "../../data/assignments";
import AssignmentFilters, {
  DEFAULT_ASSIGNMENT_FILTERS,
  filterAssignments,
  getAssignmentDeadline,
} from "../../components/student/assignments/AssignmentFilters";

import "../../styles/student/assignments.css";

const copy = {
  en: {
    eyebrow: "STUDENT WORKSPACE / ASSIGNMENTS",
    title: "Work that moves you forward.",
    intro:
      "Keep every brief, submission, and result in one focused place.",
    total: "Total",
    pending: "Pending",
    submitted: "Submitted",
    underReview: "Under review",
    graded: "Graded",
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
      under_review: "Under review",
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
    underReview: "قيد المراجعة",
    graded: "تم التقييم",
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
      under_review: "قيد المراجعة",
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
  if (typeof value === "string") return value;
  return value?.[locale] ?? value?.en ?? "";
}

function loadSubmissions() {
  return readAssignmentSubmissions();
}

function formatDate(value, locale) {
  if (!value) return "—";

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

function normalizeHistory(saved, assignmentId) {
  if (Array.isArray(saved?.submissions)) {
    return saved.submissions;
  }

  if (!saved?.submittedAt) {
    return [];
  }

  return [
    {
      id: `${assignmentId}-legacy`,
      text: saved.note ?? "",
      link: saved.projectUrl ?? "",
      submittedAt: saved.submittedAt,
      status: "submitted",
    },
  ];
}

export default function Assignments() {
  const [locale, setLocale] = useState(getLanguage);

  const [filters, setFilters] = useState({
    ...DEFAULT_ASSIGNMENT_FILTERS,
  });

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

  useEffect(() => {
    function handleStorage(event) {
      if (
        event.key === ASSIGNMENT_STORAGE_KEY ||
        event.key === null
      ) {
        setSubmissions(loadSubmissions());
      }
    }

    window.addEventListener(
      "storage",
      handleStorage
    );
    const handleAssignmentsUpdated = () =>
      setSubmissions(loadSubmissions());

    window.addEventListener(
      ASSIGNMENTS_UPDATED_EVENT,
      handleAssignmentsUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
      window.removeEventListener(
        ASSIGNMENTS_UPDATED_EVENT,
        handleAssignmentsUpdated
      );
    };
  }, []);

  const assignments = useMemo(() => {
    return mergeAssignmentSubmissions(baseAssignments, submissions).map((item) => {
      const saved = submissions[item.id];

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
        submissions: normalizeHistory(
          saved,
          item.id
        ),
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
    return filterAssignments(
      assignments,
      courses,
      filters,
      locale
    );
  }, [assignments, filters, locale]);

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
      ) ?? null
    );
  }, [assignments, selectedId]);

  function openDetails(item) {
    setSelectedId(item.id);
  }

  function closeDetails() {
    setSelectedId(null);
  }

  function saveSubmission(assignmentId, submission) {
    const assignment = assignments.find(
      (item) => item.id === assignmentId
    );

    if (
      !assignment ||
      assignment.status !== "pending"
    ) {
      return;
    }

    const deadline = getAssignmentDeadline(
      assignment.dueDate
    );

    if (
      deadline &&
      Date.now() > deadline.getTime()
    ) {
      return;
    }

    if (
      typeof submission?.text !== "string" ||
      !submission.text.trim()
    ) {
      return;
    }

    const note = submission.text.trim();

    const projectUrl =
      typeof submission.link === "string"
        ? submission.link.trim()
        : "";

    if (projectUrl) {
      try {
        const url = new URL(projectUrl);

        if (url.protocol !== "https:") {
          return;
        }
      } catch {
        return;
      }
    }

    const previous = loadSubmissions();

    // Recheck stored state to prevent overwriting
    // a previously submitted assignment.
    if (
      previous[assignmentId]?.status === "submitted"
    ) {
      setSubmissions(previous);
      return;
    }

    const existingHistory = normalizeHistory(
      previous[assignmentId],
      assignmentId
    );

    const newSubmission = {
      id:
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${assignmentId}-${Date.now()}`,
      text: note,
      link: projectUrl,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    };

    const result = saveAssignmentSubmission(assignmentId, {
      text: newSubmission.text,
      link: newSubmission.link,
    });

    if (!result.ok) return;

    setSubmissions(readAssignmentSubmissions());
    closeDetails();
  }

  function resetFilters() {
    setFilters({
      ...DEFAULT_ASSIGNMENT_FILTERS,
    });
  }

  function changeOverviewStatus(status) {
    setFilters((previous) => ({
      ...previous,
      status,
    }));
  }

  const overviewItems = [
    {
      key: "total",
      icon: ClipboardList,
      status: "all",
    },
    {
      key: "pending",
      icon: Clock3,
      status: "pending",
    },
    {
      key: "submitted",
      icon: Send,
      status: "submitted",
    },
    {
      key: "graded",
      icon: CheckCircle2,
      status: "graded",
    },
  ];

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
        {overviewItems.map(
          ({ key, icon: Icon, status }) => (
            <button
              type="button"
              key={key}
              className={
                filters.status === status
                  ? "is-active"
                  : ""
              }
              aria-pressed={
                filters.status === status
              }
              onClick={() =>
                changeOverviewStatus(status)
              }
            >
              <Icon size={18} />
              <span>{t[key]}</span>
              <strong>{counts[key]}</strong>
            </button>
          )
        )}
      </section>

      <AssignmentFilters
        language={locale}
        courses={courses}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={filtered.length}
      />

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
                    {t.statuses[item.status] ??
                      item.status}
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
