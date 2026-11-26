
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Trophy,
} from "lucide-react";

import AssignmentDetails from "../assignments/AssignmentDetails";

import {
  ASSIGNMENT_STORAGE_KEY,
  baseAssignments,
  findLessonAssignment,
  mergeAssignmentSubmissions,
  readAssignmentSubmissions,
  saveAssignmentSubmission,
} from "../../../data/assignments";

import "../../../styles/student/learning-player/learning-player-assignment.css";

const copy = {
  en: {
    eyebrow: "PRACTICAL ASSIGNMENT",
    title: "Put your knowledge into practice.",
    description:
      "Apply what you've learned and submit your work for evaluation.",
    due: "Deadline",
    points: "Points",
    pending: "Pending",
    submitted: "Submitted",
    under_review: "Under review",
    graded: "Graded",
    view: "View assignment",
    review: "Review submission",
    storageError:
      "Your submission could not be saved. Please try again.",
    submissionError:
      "Submission could not be completed. Check the deadline and submission status.",
  },
  ar: {
    eyebrow: "واجب تطبيقي",
    title: "حوّل معرفتك إلى تطبيق عملي.",
    description:
      "طبّق ما تعلمته وسلّم عملك للحصول على التقييم.",
    due: "موعد التسليم",
    points: "الدرجة",
    pending: "قيد الانتظار",
    submitted: "تم التسليم",
    under_review: "قيد المراجعة",
    graded: "تم التقييم",
    view: "عرض الواجب",
    review: "مراجعة التسليم",
    storageError:
      "تعذر حفظ التسليم. يرجى المحاولة مرة أخرى.",
    submissionError:
      "تعذر إكمال التسليم. تحقق من الموعد والحالة.",
  },
};

function localized(value, locale) {
  if (typeof value === "string") return value;
  return value?.[locale] ?? value?.en ?? "";
}

export default function LearningPlayerAssignment({
  course,
  lesson,
  assignmentId,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];

  const [submissions, setSubmissions] = useState(
    readAssignmentSubmissions
  );

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    function refresh() {
      setSubmissions(readAssignmentSubmissions());
    }

    function handleStorage(event) {
      if (
        event.key === ASSIGNMENT_STORAGE_KEY ||
        event.key === null
      ) {
        refresh();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "behar:assignments-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
      window.removeEventListener(
        "behar:assignments-updated",
        refresh
      );
    };
  }, []);

  const assignments = useMemo(
    () =>
      mergeAssignmentSubmissions(
        baseAssignments,
        submissions
      ),
    [submissions]
  );

  const assignment = useMemo(
    () =>
      findLessonAssignment({
        assignmentId:
          assignmentId ?? lesson?.assignmentId,
        courseId: course?.id,
        lessonId: lesson?.id,
        assignments,
      }),
    [
      assignmentId,
      lesson?.assignmentId,
      lesson?.id,
      course?.id,
      assignments,
    ]
  );

  useEffect(() => {
    setIsDetailsOpen(false);
    setError("");
  }, [assignment?.id, lesson?.id]);

  if (!assignment || !course) return null;

  const isCompleted =
    assignment.status === "submitted" ||
    assignment.status === "under_review" ||
    assignment.status === "graded";

  function handleSubmission(id, submission) {
    const result = saveAssignmentSubmission(
      id,
      submission
    );

    if (!result.ok) {
      setError(
        result.reason === "storage_failed"
          ? t.storageError
          : t.submissionError
      );
      return;
    }

    setSubmissions(readAssignmentSubmissions());
    setError("");
    setIsDetailsOpen(false);
  }

  return (
    <section
      className="behar-player-assignment"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="player-assignment-title"
    >
      <div className="behar-player-assignment__top">
        <span className="behar-player-assignment__eyebrow">
          <ClipboardList size={16} />
          {t.eyebrow}
        </span>

        <span
          className={`behar-player-assignment__status is-${assignment.status}`}
        >
          {isCompleted
            ? <CheckCircle2 size={14} />
            : <Clock3 size={14} />}
          {t[assignment.status] ?? assignment.status}
        </span>
      </div>

      <h2 id="player-assignment-title">
        {localized(assignment.title, locale)}
      </h2>

      <p className="behar-player-assignment__description">
        {localized(assignment.description, locale) ||
          t.description}
      </p>

      <div className="behar-player-assignment__meta">
        <span>
          <CalendarDays size={16} />
          {t.due}:{" "}
          {assignment.dueDate}
        </span>

        <span>
          <Trophy size={16} />
          {assignment.points} {t.points}
        </span>
      </div>

      {error && (
        <p
          className="behar-player-assignment__error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        className="behar-player-assignment__action"
        onClick={() => {
          setError("");
          setIsDetailsOpen(true);
        }}
      >
        {isCompleted ? t.review : t.view}
        <ArrowUpRight size={17} />
      </button>

      {isDetailsOpen && (
        <AssignmentDetails
          assignment={assignment}
          course={course}
          language={locale}
          onClose={() => setIsDetailsOpen(false)}
          onSubmit={handleSubmission}
        />
      )}
    </section>
  );
}
