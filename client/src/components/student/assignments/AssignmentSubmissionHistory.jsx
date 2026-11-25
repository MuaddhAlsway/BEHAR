
import { useMemo } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileText,
  MessageSquareText,
  Trophy,
} from "lucide-react";

import "../../../styles/student/assignments/assignment-submission-history.css";

const translations = {
  en: {
    eyebrow: "SUBMISSION ACTIVITY",
    title: "Submission history",
    description: "A record of your submitted work and review progress.",
    attempt: "Attempt",
    submitted: "Submitted",
    underReview: "Under review",
    graded: "Graded",
    submittedOn: "Submitted on",
    project: "Project link",
    openProject: "Open project",
    note: "Submission note",
    feedback: "Instructor feedback",
    score: "Score",
    noFeedback: "Your instructor has not added feedback yet.",
    emptyTitle: "No submissions yet",
    emptyDescription:
      "Your submission activity will appear here after you submit this assignment.",
    invalidLink: "Project link unavailable",
  },
  ar: {
    eyebrow: "نشاط التسليم",
    title: "سجل التسليم",
    description: "سجل أعمالك المسلّمة ومراحل مراجعتها.",
    attempt: "المحاولة",
    submitted: "تم التسليم",
    underReview: "قيد المراجعة",
    graded: "تم التقييم",
    submittedOn: "تاريخ التسليم",
    project: "رابط المشروع",
    openProject: "فتح المشروع",
    note: "ملاحظة التسليم",
    feedback: "ملاحظات المدرب",
    score: "الدرجة",
    noFeedback: "لم يضف المدرب ملاحظات بعد.",
    emptyTitle: "لا توجد تسليمات بعد",
    emptyDescription:
      "سيظهر سجل تسليماتك هنا بعد تسليم هذا الواجب.",
    invalidLink: "رابط المشروع غير متاح",
  },
};

function localized(value, locale) {
  if (typeof value === "string") return value;

  return value?.[locale] || value?.en || "";
}

function formatDate(value, locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function safeProjectUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function normalizeSubmission(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const text =
    typeof value.text === "string"
      ? value.text
      : typeof value.note === "string"
        ? value.note
        : "";

  const link =
    typeof value.link === "string"
      ? value.link
      : typeof value.projectUrl === "string"
        ? value.projectUrl
        : "";

  const submittedAt = value.submittedAt;

  if (
    typeof submittedAt !== "string" ||
    !Number.isFinite(Date.parse(submittedAt))
  ) {
    return null;
  }

  return {
    id: value.id ?? null,
    text,
    link,
    submittedAt,
    status: value.status,
    feedback: value.feedback ?? null,
    grade: value.grade ?? null,
  };
}

function getSubmissionHistory(assignment) {
  if (!assignment) return [];

  const history = Array.isArray(assignment.submissions)
    ? assignment.submissions
    : [];

  const normalized = history
    .map(normalizeSubmission)
    .filter(Boolean);

  // Support the existing single-submission storage format.
  if (normalized.length === 0) {
    const legacy = normalizeSubmission(
      assignment.submission ??
        (assignment.submittedAt
          ? {
              note: assignment.note,
              projectUrl: assignment.projectUrl,
              submittedAt: assignment.submittedAt,
              status: assignment.status,
            }
          : null)
    );

    if (legacy) normalized.push(legacy);
  }

  return normalized.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() -
      new Date(a.submittedAt).getTime()
  );
}

function getStatus(submission, assignment) {
  if (
    submission.feedback ||
    submission.grade !== null ||
    assignment.status === "graded"
  ) {
    return "graded";
  }

  if (submission.status === "under_review") {
    return "under_review";
  }

  return "submitted";
}

export default function AssignmentSubmissionHistory({
  assignment,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const history = useMemo(
    () => getSubmissionHistory(assignment),
    [assignment]
  );

  return (
    <section
      className="behar-submission-history"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-submission-history-title"
    >
      <header className="behar-submission-history__header">
        <span className="behar-submission-history__eyebrow">
          <ClipboardList size={15} />
          {t.eyebrow}
        </span>

        <h3 id="behar-submission-history-title">
          {t.title}
        </h3>

        <p>{t.description}</p>
      </header>

      {history.length === 0 ? (
        <div className="behar-submission-history__empty">
          <span className="behar-submission-history__empty-icon">
            <FileText size={23} />
          </span>

          <h4>{t.emptyTitle}</h4>
          <p>{t.emptyDescription}</p>
        </div>
      ) : (
        <ol className="behar-submission-history__timeline">
          {history.map((submission, index) => {
            const status = getStatus(
              submission,
              assignment
            );

            const statusText =
              status === "graded"
                ? t.graded
                : status === "under_review"
                  ? t.underReview
                  : t.submitted;

            const StatusIcon =
              status === "graded"
                ? Trophy
                : status === "under_review"
                  ? Clock3
                  : CheckCircle2;

            const projectUrl = safeProjectUrl(
              submission.link
            );

            const feedback =
              submission.feedback ??
              (status === "graded"
                ? assignment.feedback
                : null);

            const grade =
              submission.grade ??
              (status === "graded"
                ? assignment.grade
                : null);

            return (
              <li
                className="behar-submission-history__item"
                key={
                  submission.id ??
                  `${submission.submittedAt}-${index}`
                }
              >
                <div className="behar-submission-history__marker">
                  <StatusIcon size={16} />
                </div>

                <article className="behar-submission-history__card">
                  <div className="behar-submission-history__card-top">
                    <span className="behar-submission-history__attempt">
                      {t.attempt} {history.length - index}
                    </span>

                    <span
                      className={`behar-submission-history__status is-${status}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  <div className="behar-submission-history__date">
                    <Clock3 size={14} />
                    <span>
                      {t.submittedOn}:{" "}
                      {formatDate(
                        submission.submittedAt,
                        locale
                      )}
                    </span>
                  </div>

                  {submission.text && (
                    <div className="behar-submission-history__section">
                      <span className="behar-submission-history__label">
                        <MessageSquareText size={15} />
                        {t.note}
                      </span>

                      <p>{submission.text}</p>
                    </div>
                  )}

                  {submission.link && (
                    <div className="behar-submission-history__section">
                      <span className="behar-submission-history__label">
                        <ExternalLink size={15} />
                        {t.project}
                      </span>

                      {projectUrl ? (
                        <a
                          href={projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="behar-submission-history__project-link"
                        >
                          {t.openProject}
                          <ArrowUpRight size={15} />
                        </a>
                      ) : (
                        <p>{t.invalidLink}</p>
                      )}
                    </div>
                  )}

                  {status === "graded" && (
                    <div className="behar-submission-history__feedback">
                      {grade !== null && (
                        <div className="behar-submission-history__score">
                          <span>{t.score}</span>
                          <strong>
                            {grade}
                            {typeof grade === "number"
                              ? ` / ${assignment.points}`
                              : ""}
                          </strong>
                        </div>
                      )}

                      <span className="behar-submission-history__label">
                        <MessageSquareText size={15} />
                        {t.feedback}
                      </span>

                      <p>
                        {localized(
                          feedback?.comment,
                          locale
                        ) || t.noFeedback}
                      </p>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
