
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  LockKeyhole,
  RotateCcw,
  XCircle,
} from "lucide-react";

import "../../../styles/student/assessments/assessment-status.css";

const labels = {
  en: {
    available: "Available",
    in_progress: "In progress",
    passed: "Passed",
    failed: "Not passed",
    exhausted: "Attempts exhausted",
    attempts: "attempts left",
    score: "Best score",
    progress: "Completion",
    start: "Start assessment",
    resume: "Continue assessment",
    retry: "Try again",
    review: "View result",
    unavailable: "Unavailable",
  },
  ar: {
    available: "متاح",
    in_progress: "قيد التنفيذ",
    passed: "ناجح",
    failed: "لم ينجح",
    exhausted: "انتهت المحاولات",
    attempts: "محاولات متبقية",
    score: "أفضل درجة",
    progress: "نسبة الإكمال",
    start: "بدء الاختبار",
    resume: "متابعة الاختبار",
    retry: "إعادة المحاولة",
    review: "عرض النتيجة",
    unavailable: "غير متاح",
  },
};

const statusIcons = {
  available: CircleDashed,
  in_progress: Clock3,
  passed: CheckCircle2,
  failed: XCircle,
  exhausted: LockKeyhole,
  unavailable: LockKeyhole,
};

export default function AssessmentStatus({
  status = "available",
  language = "en",
  title,
  description,
  remainingAttempts = 0,
  progress = 0,
  bestScore = null,
  onAction,
  disabled = false,
  compact = false,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = labels[lang];

  const safeStatus = statusIcons[status]
    ? status
    : "unavailable";

  const Icon = statusIcons[safeStatus];

  const actionLabel = {
    available: t.start,
    in_progress: t.resume,
    passed: t.review,
    failed: t.retry,
    exhausted: t.review,
    unavailable: t.unavailable,
  }[safeStatus];

  const actionDisabled =
    disabled ||
    typeof onAction !== "function" ||
    safeStatus === "unavailable" ||
    (
      safeStatus === "exhausted" &&
      bestScore === null
    );

  return (
    <article
      className={[
        "behar-assessment-status",
        `behar-assessment-status--${safeStatus}`,
        compact ? "is-compact" : "",
      ].filter(Boolean).join(" ")}
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-assessment-status__top">
        <div className="behar-assessment-status__icon">
          <Icon size={22} strokeWidth={1.8} />
        </div>

        <span className="behar-assessment-status__badge">
          {t[safeStatus]}
        </span>
      </div>

      <div className="behar-assessment-status__body">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>

      <div className="behar-assessment-status__metrics">
        {safeStatus === "in_progress" ? (
          <div className="behar-assessment-status__progress">
            <div className="behar-assessment-status__metric-heading">
              <span>{t.progress}</span>
              <strong>{progress}%</strong>
            </div>

            <div
              className="behar-assessment-status__track"
              role="progressbar"
              aria-label={t.progress}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, progress)
                  )}%`,
                }}
              />
            </div>
          </div>
        ) : bestScore !== null ? (
          <div className="behar-assessment-status__metric">
            <span>{t.score}</span>
            <strong>{bestScore}%</strong>
          </div>
        ) : null}

        <div className="behar-assessment-status__metric">
          <span>{t.attempts}</span>
          <strong>{remainingAttempts}</strong>
        </div>
      </div>

      {typeof onAction === "function" && (
        <button
          type="button"
          className="behar-assessment-status__action"
          onClick={onAction}
          disabled={actionDisabled}
        >
          <span>{actionLabel}</span>
          {safeStatus === "failed" && (
            <RotateCcw size={16} />
          )}
        </button>
      )}
    </article>
  );
}
