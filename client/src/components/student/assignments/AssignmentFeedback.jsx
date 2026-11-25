
import { useMemo } from "react";
import {
  Award,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  MessageSquareText,
} from "lucide-react";

import "../../../styles/student/assignments/assignment-feedback.css";

const copy = {
  en: {
    eyebrow: "INSTRUCTOR EVALUATION",
    title: "Assignment feedback",
    submitted: "Submitted",
    underReview: "Under review",
    graded: "Graded",
    pending: "Not submitted",
    score: "Your score",
    outOf: "out of",
    evaluatedOn: "Evaluated on",
    feedback: "Instructor feedback",
    rubric: "Grading breakdown",
    emptyTitle: "Feedback isn't available yet",
    emptyPending:
      "Submit your assignment to begin the evaluation process.",
    emptySubmitted:
      "Your work has been submitted. Feedback will appear when your instructor completes the evaluation.",
    emptyReview:
      "Your instructor is reviewing your work. The evaluation will appear here once completed.",
    noComment: "No written feedback was provided.",
    noScore: "A numerical score is not available.",
    points: "points",
  },
  ar: {
    eyebrow: "تقييم المدرب",
    title: "تقييم الواجب",
    submitted: "تم التسليم",
    underReview: "قيد المراجعة",
    graded: "تم التقييم",
    pending: "لم يتم التسليم",
    score: "درجتك",
    outOf: "من",
    evaluatedOn: "تاريخ التقييم",
    feedback: "ملاحظات المدرب",
    rubric: "تفاصيل التقييم",
    emptyTitle: "التقييم غير متاح بعد",
    emptyPending:
      "سلّم الواجب لبدء عملية التقييم.",
    emptySubmitted:
      "تم تسليم عملك، وستظهر الملاحظات بعد انتهاء المدرب من التقييم.",
    emptyReview:
      "المدرب يراجع عملك حالياً، وسيظهر التقييم بعد الانتهاء.",
    noComment: "لم تتم إضافة ملاحظات مكتوبة.",
    noScore: "لا توجد درجة رقمية متاحة.",
    points: "درجة",
  },
};

function localized(value, locale) {
  if (typeof value === "string") return value;
  return value?.[locale] ?? value?.en ?? "";
}

function formatDate(value, locale) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function parseScore(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { earned: value, maximum: null };
  }

  if (typeof value !== "string") return null;

  const match = value
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?))?$/);

  if (!match) return null;

  return {
    earned: Number(match[1]),
    maximum: match[2] ? Number(match[2]) : null,
  };
}

function getRubric(assignment) {
  const rubric =
    assignment?.feedback?.rubric ??
    assignment?.rubricResults ??
    [];

  if (!Array.isArray(rubric)) return [];

  return rubric
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const score = parseScore(item.score ?? item.earned);
      const maximum = Number(
        item.maxPoints ?? item.maximum ?? score?.maximum
      );

      return {
        id: item.id ?? `criterion-${index}`,
        title: item.title ?? item.criterion ?? "",
        description: item.description ?? "",
        earned: score?.earned ?? null,
        maximum:
          Number.isFinite(maximum) && maximum > 0
            ? maximum
            : null,
      };
    });
}

export default function AssignmentFeedback({
  assignment,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];

  const status = assignment?.status ?? "pending";
  const isGraded = status === "graded";

  const feedback = assignment?.feedback ?? null;

  const score = useMemo(
    () => parseScore(feedback?.score ?? assignment?.grade),
    [feedback?.score, assignment?.grade]
  );

  const maximum =
    score?.maximum ??
    (typeof assignment?.points === "number"
      ? assignment.points
      : null);

  const percentage =
    isGraded &&
    score &&
    maximum > 0 &&
    score.earned >= 0 &&
    score.earned <= maximum
      ? Math.round((score.earned / maximum) * 100)
      : null;

  const rubric = useMemo(
    () => getRubric(assignment),
    [assignment]
  );

  const evaluatedAt = formatDate(
    feedback?.evaluatedAt ??
      feedback?.gradedAt ??
      assignment?.gradedAt,
    locale
  );

  const comment = localized(
    feedback?.comment ?? feedback?.comments,
    locale
  );

  const statusLabel =
    status === "graded"
      ? t.graded
      : status === "under_review"
        ? t.underReview
        : status === "submitted"
          ? t.submitted
          : t.pending;

  const emptyDescription =
    status === "under_review"
      ? t.emptyReview
      : status === "submitted"
        ? t.emptySubmitted
        : t.emptyPending;

  return (
    <section
      className="behar-assignment-feedback"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="assignment-feedback-title"
    >
      <header className="behar-assignment-feedback__header">
        <div>
          <span className="behar-assignment-feedback__eyebrow">
            <ClipboardCheck size={15} />
            {t.eyebrow}
          </span>

          <h3 id="assignment-feedback-title">{t.title}</h3>
        </div>

        <span
          className={`behar-assignment-feedback__status is-${status}`}
        >
          {isGraded ? (
            <CheckCircle2 size={14} />
          ) : (
            <Clock3 size={14} />
          )}
          {statusLabel}
        </span>
      </header>

      {!isGraded ? (
        <div className="behar-assignment-feedback__empty">
          <span className="behar-assignment-feedback__empty-icon">
            <MessageSquareText size={23} />
          </span>

          <h4>{t.emptyTitle}</h4>
          <p>{emptyDescription}</p>
        </div>
      ) : (
        <div className="behar-assignment-feedback__body">
          <div className="behar-assignment-feedback__score-card">
            <div className="behar-assignment-feedback__score-top">
              <span>{t.score}</span>
              <Award size={21} />
            </div>

            {score ? (
              <>
                <div className="behar-assignment-feedback__score-value">
                  <strong>{score.earned}</strong>

                  {maximum !== null && (
                    <span>
                      / {maximum} {t.points}
                    </span>
                  )}
                </div>

                {percentage !== null && (
                  <>
                    <div
                      className="behar-assignment-feedback__progress"
                      role="progressbar"
                      aria-label={t.score}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="behar-assignment-feedback__percentage">
                      {percentage}%
                    </span>
                  </>
                )}
              </>
            ) : (
              <p className="behar-assignment-feedback__no-score">
                {t.noScore}
              </p>
            )}

            {evaluatedAt && (
              <div className="behar-assignment-feedback__date">
                <Clock3 size={14} />
                {t.evaluatedOn}: {evaluatedAt}
              </div>
            )}
          </div>

          <div className="behar-assignment-feedback__comment">
            <h4>
              <MessageSquareText size={17} />
              {t.feedback}
            </h4>

            <p>{comment || t.noComment}</p>
          </div>

          {rubric.length > 0 && (
            <div className="behar-assignment-feedback__rubric">
              <h4>{t.rubric}</h4>

              <div className="behar-assignment-feedback__criteria">
                {rubric.map((criterion) => {
                  const validScore =
                    criterion.earned !== null &&
                    criterion.maximum !== null &&
                    criterion.earned >= 0 &&
                    criterion.earned <= criterion.maximum;

                  const progress = validScore
                    ? (criterion.earned /
                        criterion.maximum) *
                      100
                    : null;

                  return (
                    <article
                      key={criterion.id}
                      className="behar-assignment-feedback__criterion"
                    >
                      <div className="behar-assignment-feedback__criterion-top">
                        <strong>
                          {localized(
                            criterion.title,
                            locale
                          )}
                        </strong>

                        {validScore && (
                          <span>
                            {criterion.earned} /{" "}
                            {criterion.maximum}
                          </span>
                        )}
                      </div>

                      {criterion.description && (
                        <p>
                          {localized(
                            criterion.description,
                            locale
                          )}
                        </p>
                      )}

                      {progress !== null && (
                        <div className="behar-assignment-feedback__criterion-bar">
                          <span
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
