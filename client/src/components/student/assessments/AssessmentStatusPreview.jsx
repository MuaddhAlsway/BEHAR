
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import useAssessment from "../../../hooks/useAssessment";
import {
  getLocalizedText,
} from "../../../utils/assessmentService";

import AssessmentStatus from "./AssessmentStatus";

import "../../../styles/student/assessments/assessment-status-preview.css";

const copy = {
  en: {
    eyebrow: "P14.4.0.6 / ASSESSMENT STATUS",
    heading: "Progress, made visible.",
    description:
      "One status card, driven by saved attempts and assessment progress.",
    refresh: "Refresh status",
    active: "Current assessment",
    attempts: "Submission history",
    empty: "No attempts submitted.",
    last: "Latest submission",
    best: "Best score",
    result: "Latest result",
    passed: "Passed",
    failed: "Not passed",
    error: "Unable to load assessment status.",
    note:
      "This preview uses localStorage. Learning Player navigation will be connected in P14.4.0.7.",
    started: "Assessment attempt started.",
    resume: "An unfinished attempt is ready to resume.",
    review:
      "Result review will be connected in the Learning Player.",
  },
  ar: {
    eyebrow: "P14.4.0.6 / حالة الاختبار",
    heading: "تقدمك أصبح واضحاً.",
    description:
      "بطاقة تعرض حالة الاختبار اعتماداً على المحاولات المحفوظة.",
    refresh: "تحديث الحالة",
    active: "الاختبار الحالي",
    attempts: "سجل الإرسال",
    empty: "لا توجد محاولات مرسلة.",
    last: "آخر محاولة",
    best: "أفضل درجة",
    result: "آخر نتيجة",
    passed: "ناجح",
    failed: "لم ينجح",
    error: "تعذر تحميل حالة الاختبار.",
    note:
      "هذه معاينة محلية. سيتم ربط التنقل بمشغل الدروس في المرحلة التالية.",
    started: "تم بدء محاولة الاختبار.",
    resume: "توجد محاولة غير مكتملة يمكن استئنافها.",
    review:
      "سيتم ربط مراجعة النتائج بمشغل الدروس.",
  },
};

export default function AssessmentStatusPreview({
  assessmentId = "react-basics-quiz",
  studentId = "dev-student-001",
  language = "en",
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = copy[lang];

  const {
    assessment,
    attempt,
    history,
    remainingAttempts,
    progress,
    isActive,
    loading,
    error,
    start,
    refresh,
  } = useAssessment({ assessmentId, studentId });

  const [message, setMessage] = useState("");

  const submitted = useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() -
          new Date(a.submittedAt).getTime()
      ),
    [history]
  );

  const latest = submitted[0] ?? null;

  const bestScore = submitted.length
    ? Math.max(
        ...submitted.map(
          (item) => item.result?.percentage ?? 0
        )
      )
    : null;

  const hasPassed = submitted.some(
    (item) => item.result?.passed === true
  );

  let status = "available";

  if (loading || error || !assessment) {
    status = "unavailable";
  } else if (isActive) {
    status = "in_progress";
  } else if (remainingAttempts === 0) {
    status = "exhausted";
  } else if (hasPassed) {
    status = "passed";
  } else if (submitted.length > 0) {
    status = "failed";
  }

  function handleAction() {
    setMessage("");

    if (status === "in_progress") {
      setMessage(t.resume);
      return;
    }

    if (
      status === "passed" ||
      status === "exhausted"
    ) {
      setMessage(t.review);
      return;
    }

    const next = start();

    if (next) {
      setMessage(t.started);
    }
  }

  function handleRefresh() {
    refresh();
    setMessage("");
  }

  return (
    <section
      className="behar-status-preview"
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-status-preview__container">
        <header className="behar-status-preview__header">
          <div>
            <span className="behar-status-preview__eyebrow">
              <Activity size={15} />
              {t.eyebrow}
            </span>

            <h2>{t.heading}</h2>
            <p>{t.description}</p>
          </div>

          <button
            type="button"
            className="behar-status-preview__refresh"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </header>

        {error && (
          <div
            className="behar-status-preview__error"
            role="alert"
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {message && (
          <div
            className="behar-status-preview__message"
            role="status"
          >
            {message}
          </div>
        )}

        <div className="behar-status-preview__grid">
          <div className="behar-status-preview__primary">
            <span className="behar-status-preview__label">
              01 / {t.active}
            </span>

            <AssessmentStatus
              status={status}
              language={lang}
              title={getLocalizedText(
                assessment?.title,
                lang
              )}
              description={getLocalizedText(
                assessment?.description,
                lang
              )}
              remainingAttempts={remainingAttempts}
              progress={progress}
              bestScore={bestScore}
              onAction={handleAction}
              disabled={loading || Boolean(error)}
            />
          </div>

          <aside className="behar-status-preview__history">
            <div className="behar-status-preview__history-heading">
              <span className="behar-status-preview__label">
                02 / {t.attempts}
              </span>
              <ArrowUpRight size={20} />
            </div>

            {latest ? (
              <>
                <div className="behar-status-preview__latest">
                  <span>{t.last}</span>
                  <strong>
                    #{latest.attemptNumber}
                  </strong>
                </div>

                <div className="behar-status-preview__score">
                  <span>{t.best}</span>
                  <strong>{bestScore}%</strong>
                </div>

                <div className="behar-status-preview__latest">
                  <span>{t.result}</span>
                  <strong
                    className={
                      latest.result?.passed
                        ? "is-passed"
                        : "is-failed"
                    }
                  >
                    {latest.result?.passed
                      ? t.passed
                      : t.failed}
                  </strong>
                </div>
              </>
            ) : (
              <p className="behar-status-preview__empty">
                {t.empty}
              </p>
            )}
          </aside>
        </div>

        <footer className="behar-status-preview__footer">
          <span>{t.note}</span>
          <span>P14.4.0.6</span>
        </footer>
      </div>
    </section>
  );
}
