
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Link2,
  Send,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

import '../../styles/student/assignments/assignment-details.css'
import AssignmentSubmissionHistory from "../../components/student/assignments/AssignmentSubmissionHistory";
import AssignmentFeedback from "../../components/student/assignments/AssignmentFeedback";

const copy = {
  en: {
    eyebrow: "ASSIGNMENT DETAILS",
    course: "Course",
    instructor: "Instructor",
    deadline: "Deadline",
    points: "Maximum points",
    submission: "Your submission",
    note: "Submission note",
    link: "Project URL (optional)",
    placeholder: "Describe your completed work...",
    linkPlaceholder: "https://github.com/...",
    submit: "Submit assignment",
    submittedAt: "Submitted on",
    close: "Close",
    cancel: "Cancel",
    required: "Please enter a submission note.",
    invalidUrl: "Enter a valid HTTPS URL.",
    late: "The deadline has passed.",
    submissionLocked:
      "This assignment has already been submitted. Resubmission is not available.",
    gradedLocked:
      "This assignment has been graded and cannot be changed.",
  },
  ar: {
    eyebrow: "تفاصيل الواجب",
    course: "الدورة",
    instructor: "المدرب",
    deadline: "موعد التسليم",
    points: "الدرجة القصوى",
    submission: "تسليمك",
    note: "ملاحظة التسليم",
    link: "رابط المشروع (اختياري)",
    placeholder: "اشرح العمل الذي أنجزته...",
    linkPlaceholder: "https://github.com/...",
    submit: "تسليم الواجب",
    submittedAt: "تاريخ التسليم",
    close: "إغلاق",
    cancel: "إلغاء",
    required: "يرجى كتابة ملاحظة التسليم.",
    invalidUrl: "أدخل رابط HTTPS صالحاً.",
    late: "انتهى موعد تسليم هذا الواجب.",
    submissionLocked:
      "تم تسليم هذا الواجب مسبقاً ولا يمكن إعادة التسليم.",
    gradedLocked:
      "تم تقييم هذا الواجب ولا يمكن تعديله.",
  },
};

function localized(value, locale) {
  if (typeof value === "string") return value;
  return value?.[locale] || value?.en || "";
}

function formatDate(value, locale) {
  if (!value) return "—";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function isValidHttpsUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "https:" &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function isPastDeadline(dueDate) {
  if (!dueDate) return false;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    const [year, month, day] = dueDate
      .split("-")
      .map(Number);

    const deadline = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999
    );

    return Date.now() > deadline.getTime();
  }

  const deadline = new Date(dueDate);

  return (
    !Number.isNaN(deadline.getTime()) &&
    Date.now() > deadline.getTime()
  );
}

export default function AssignmentDetails({
  assignment,
  course,
  language = "en",
  onClose,
  onSubmit,
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  const [note, setNote] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const isGraded = assignment?.status === "graded";

  const isSubmitted =
    assignment?.status === "submitted" ||
    assignment?.status === "under_review";

  const isOverdue =
    !isGraded &&
    !isSubmitted &&
    isPastDeadline(assignment?.dueDate);

  const locked = isGraded || isSubmitted || isOverdue;

  useEffect(() => {
    if (!assignment) return;

    setNote(
      assignment.submission?.text ??
        assignment.note ??
        ""
    );

    setProjectUrl(
      assignment.submission?.link ??
        assignment.projectUrl ??
        ""
    );

    setError("");
  }, [assignment]);

  useEffect(() => {
    if (!assignment) return;

    const previousFocus = document.activeElement;
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]'
        );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [assignment?.id]);

  if (!assignment) return null;

  const submittedAt =
    assignment.submission?.submittedAt ??
    assignment.submittedAt ??
    null;

  function handleSubmit(event) {
    event.preventDefault();

    if (locked) return;

    if (!note.trim()) {
      setError(t.required);
      return;
    }

    if (!isValidHttpsUrl(projectUrl)) {
      setError(t.invalidUrl);
      return;
    }

    setError("");

    onSubmit?.(assignment.id, {
      text: note.trim(),
      link: projectUrl.trim(),
      submittedAt: new Date().toISOString(),
    });
  }

  return (
    <div
      className="behar-assignment-details"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        className="behar-assignment-details__backdrop"
        aria-label={t.close}
        onClick={onClose}
      />

      <section
        ref={dialogRef}
        className="behar-assignment-details__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-details-title"
        aria-describedby="assignment-details-description"
      >
        <header className="behar-assignment-details__header">
          <span className="behar-assignment-details__eyebrow">
            <FileText size={15} />
            {t.eyebrow}
          </span>

          <button
            ref={closeRef}
            type="button"
            className="behar-assignment-details__close"
            aria-label={t.close}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="behar-assignment-details__content">
          <h2 id="assignment-details-title">
            {localized(assignment.title, locale)}
          </h2>

          <p
            id="assignment-details-description"
            className="behar-assignment-details__intro"
          >
            {localized(
              assignment.description,
              locale
            )}
          </p>

          <div className="behar-assignment-details__metadata">
            <div>
              <BookOpen size={18} />
              <span>{t.course}</span>
              <strong>
                {localized(course?.title, locale)}
              </strong>
            </div>

            <div>
              <UserRound size={18} />
              <span>{t.instructor}</span>
              <strong>
                {localized(
                  assignment.instructor,
                  locale
                )}
              </strong>
            </div>

            <div>
              <CalendarDays size={18} />
              <span>{t.deadline}</span>
              <strong>
                {formatDate(
                  assignment.dueDate,
                  locale
                )}
              </strong>
            </div>

            <div>
              <Trophy size={18} />
              <span>{t.points}</span>
              <strong>{assignment.points}</strong>
            </div>
          </div>

          <div className="behar-assignment-details__divider" />

          <section className="behar-assignment-details__submission">
            <h3>{t.submission}</h3>

            {isGraded && (
              <div className="behar-assignment-details__notice is-graded">
                <CheckCircle2 size={19} />
                {t.gradedLocked}
              </div>
            )}

            {isSubmitted && (
              <div className="behar-assignment-details__notice is-submitted">
                <CheckCircle2 size={19} />
                {t.submissionLocked}
              </div>
            )}

            {isOverdue && (
              <div className="behar-assignment-details__notice is-overdue">
                <Clock3 size={19} />
                {t.late}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="assignment-submission-note">
                {t.note}
              </label>

              <textarea
                id="assignment-submission-note"
                rows={5}
                maxLength={5000}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setError("");
                }}
                placeholder={t.placeholder}
                disabled={locked}
              />

              <label htmlFor="assignment-project-url">
                <Link2 size={15} />
                {t.link}
              </label>

              <input
                id="assignment-project-url"
                type="url"
                value={projectUrl}
                onChange={(event) => {
                  setProjectUrl(event.target.value);
                  setError("");
                }}
                placeholder={t.linkPlaceholder}
                disabled={locked}
              />

              {submittedAt && (
                <p className="behar-assignment-details__submitted-at">
                  <CheckCircle2 size={15} />
                  {t.submittedAt}:{" "}
                  {formatDate(
                    submittedAt,
                    locale
                  )}
                </p>
              )}

              {error && (
                <p
                  className="behar-assignment-details__error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="behar-assignment-details__actions">
                <button
                  type="button"
                  className="behar-assignment-details__cancel"
                  onClick={onClose}
                >
                  {t.cancel}
                </button>

                {!locked && (
                  <button
                    type="submit"
                    className="behar-assignment-details__submit"
                  >
                    {t.submit}
                    <Send size={16} />
                  </button>
                )}
              </div>
            </form>
          </section>

          <AssignmentSubmissionHistory
            assignment={assignment}
            language={locale}
          />

          <AssignmentFeedback
            assignment={assignment}
            language={locale}
          />
        </div>
      </section>
    </div>
  );
}
